import db from "../config/db.js";
import s3 from "../config/s3.js";
import { uploadToS3, deleteFromS3 } from "../services/s3Service.js";

// ================= UPLOAD FILE =================
export const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.user.id;
    const { folder_id } = req.body;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileKey = await uploadToS3(file);

    db.query(
      `INSERT INTO files 
      (user_id, file_name, file_type, file_size, file_key, folder_id)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId,
        file.originalname,
        file.mimetype,
        file.size,
        fileKey,
        folder_id || null,
      ],
      (err, result) => {
        if (err) {
          console.error("DB Insert Error:", err);
          return res.status(500).json({ message: "DB error" });
        }

        res.status(201).json({
          message: "File uploaded successfully",
          file: { id: result.insertId, name: file.originalname },
        });
      }
    );
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Upload failed" });
  }
};

// ================= GET FILES =================
export const getFiles = (req, res) => {
  const userId = req.user.id;
  const { folder_id } = req.query;

  let query = `SELECT id, file_name, file_type, file_size, file_key, folder_id
               FROM files WHERE user_id = ? AND is_deleted = FALSE`;
  let values = [userId];

  if (folder_id) {
    query += " AND folder_id = ?";
    values.push(folder_id);
  } else {
    query += " AND folder_id IS NULL";
  }

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Get Files DB Error:", err);
      return res.status(500).json({ message: "DB error" });
    }

    const filesWithUrls = results.map((file) => ({
      ...file,
      name: file.file_name,
      type: file.file_type,
      url: `api/files/${file.id}/view`,
      download_url: `api/files/${file.id}/download`,
    }));

    res.json({ files: filesWithUrls });
  });
};

// ================= VIEW / STREAM FILE =================
export const streamFile = async (req, res) => {
  try {
    const [results] = await db.promise().query(
      "SELECT file_key, file_name, file_type FROM files WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    const file = results[0];

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.file_key,
    };

    const range = req.headers.range;

    if (range) {
      const head = await s3.headObject(params).promise();
      const fileSize = head.ContentLength;

      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      const chunkSize = end - start + 1;

      const stream = s3.getObject({
        ...params,
        Range: `bytes=${start}-${end}`,
      }).createReadStream();

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": file.file_type || "application/octet-stream",
        "Content-Disposition": `inline; filename="${encodeURIComponent(file.file_name)}"`,
      });

      stream.pipe(res);
    } else {
      const stream = s3.getObject(params).createReadStream();

      stream.on("error", (err) => {
        console.error("S3 Stream Error:", err);
        if (!res.headersSent) {
          res.status(500).json({ message: "Stream error" });
        }
      });

      res.setHeader("Content-Type", file.file_type || "application/octet-stream");
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${encodeURIComponent(file.file_name)}"`
      );
      res.setHeader("Accept-Ranges", "bytes");

      stream.pipe(res);
    }
  } catch (error) {
    console.error("Stream File Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to stream file" });
    }
  }
};

// ================= DOWNLOAD FILE =================
export const downloadFile = async (req, res) => {
  try {
    const [results] = await db.promise().query(
      "SELECT file_key, file_name, file_type FROM files WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    const file = results[0];

    const stream = s3
      .getObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.file_key,
      })
      .createReadStream();

    stream.on("error", (err) => {
      console.error("S3 Download Error:", err);
      if (!res.headersSent) {
        res.status(500).json({ message: "Download error" });
      }
    });

    res.setHeader("Content-Type", file.file_type || "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(file.file_name)}"`
    );

    stream.pipe(res);
  } catch (error) {
    console.error("Download File Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to download file" });
    }
  }
};

// ================= DELETE =================
export const deleteFile = (req, res) => {
  db.query(
    "UPDATE files SET is_deleted = TRUE WHERE id = ? AND user_id = ?",
    [req.params.id, req.user.id],
    (err) => {
      if (err) return res.status(500).json({ message: "Delete failed" });
      res.json({ message: "Moved to trash" });
    }
  );
};

// ================= GET TRASH =================
export const getTrashFiles = (req, res) => {
  db.query(
    "SELECT * FROM files WHERE user_id = ? AND is_deleted = TRUE",
    [req.user.id],
    (err, results) => {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json({ files: results });
    }
  );
};

// ================= RESTORE =================
export const restoreFile = (req, res) => {
  db.query(
    "UPDATE files SET is_deleted = FALSE WHERE id = ? AND user_id = ?",
    [req.params.id, req.user.id],
    (err) => {
      if (err) return res.status(500).json({ message: "Restore failed" });
      res.json({ message: "File restored successfully" });
    }
  );
};

// ================= PERMANENT DELETE =================
export const permanentDeleteFile = async (req, res) => {
  try {
    const [results] = await db.promise().query(
      "SELECT file_key FROM files WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    const file = results[0];

    if (file.file_key) {
      await deleteFromS3(file.file_key);
    }

    await db.promise().query(
      "DELETE FROM files WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );

    res.json({ message: "File permanently deleted" });
  } catch (error) {
    console.error("Permanent Delete Error:", error);
    res.status(500).json({ message: "Delete failed" });
  }
};

// ================= EMPTY TRASH (NEW 🔥) =================
export const emptyTrashFiles = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Get all deleted files
    const [files] = await db.promise().query(
      "SELECT file_key FROM files WHERE user_id = ? AND is_deleted = TRUE",
      [userId]
    );

    // 2. Delete from S3
    for (const file of files) {
      if (file.file_key) {
        try {
          await deleteFromS3(file.file_key);
        } catch (err) {
          console.error("S3 delete error:", err.message);
        }
      }
    }

    // 3. Delete from DB
    await db.promise().query(
      "DELETE FROM files WHERE user_id = ? AND is_deleted = TRUE",
      [userId]
    );

    res.json({ message: "Trash emptied successfully" });
  } catch (error) {
    console.error("Empty Trash Error:", error);
    res.status(500).json({ message: "Failed to empty trash" });
  }
};

// ================= RENAME =================
export const renameFile = (req, res) => {
  db.query(
    "UPDATE files SET file_name = ? WHERE id = ? AND user_id = ?",
    [req.body.new_name, req.params.id, req.user.id],
    (err) => {
      if (err) return res.status(500).json({ message: "Rename failed" });
      res.json({ message: "File renamed successfully" });
    }
  );
};