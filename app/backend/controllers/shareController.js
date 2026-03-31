import db from "../config/db.js";
import crypto from "crypto";

// ================= GENERATE SHARE LINK =================
export const generateShareLink = (req, res) => {
  const fileId = req.params.id;
  const userId = req.user.id;

  // Generate random token
  const token = crypto.randomBytes(20).toString("hex");

  const query = `
    INSERT INTO shares (file_id, user_id, token)
    VALUES (?, ?, ?)
  `;

  db.query(query, [fileId, userId, token], (err) => {
    if (err) {
      return res.status(500).json({
        message: "Error generating share link",
        error: err.message,
      });
    }

    const publicUrl = `${process.env.BASE_URL}/public/${token}`;

    res.json({
      message: "Share link created",
      url: publicUrl,
    });
  });
};

// ================= ACCESS SHARED FILE =================
export const accessSharedFile = (req, res) => {
  const token = req.params.token;

  const query = `
    SELECT files.* FROM shares
    JOIN files ON shares.file_id = files.id
    WHERE shares.token = ?
  `;

  db.query(query, [token], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Error accessing file",
        error: err.message,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Invalid or expired link",
      });
    }

    const file = results[0];

    res.json({
      file_name: file.file_name,
      file_url: file.file_url,
    });
  });
};