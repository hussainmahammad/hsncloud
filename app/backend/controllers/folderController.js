import db from "../config/db.js";

// ================= CREATE FOLDER =================
export const createFolder = (req, res) => {
  const { folder_name, parent_id } = req.body;
  const userId = req.user.id;

  if (!folder_name || folder_name.trim() === "") {
    return res.status(400).json({ message: "Folder name is required" });
  }

  const query = `
    INSERT INTO folders (user_id, folder_name, parent_id)
    VALUES (?, ?, ?)
  `;

  db.query(
    query,
    [userId, folder_name.trim(), parent_id || null],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Error creating folder",
          error: err.message,
        });
      }

      res.status(201).json({
        message: "Folder created",
        folder: {
          id: result.insertId,
          name: folder_name,
        },
      });
    }
  );
};

// ================= GET FOLDERS =================
export const getFolders = (req, res) => {
  const userId = req.user.id;
  const { parent_id } = req.query;

  let query =
    "SELECT * FROM folders WHERE user_id = ? AND is_deleted = FALSE";
  let values = [userId];

  if (parent_id) {
    query += " AND parent_id = ?";
    values.push(parent_id);
  } else {
    query += " AND parent_id IS NULL";
  }

  db.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "DB error",
        error: err.message,
      });
    }

    res.json(results);
  });
};

// ================= RENAME FOLDER =================
export const renameFolder = (req, res) => {
  const folderId = req.params.id;
  const { new_name } = req.body;
  const userId = req.user.id;

  if (!new_name || new_name.trim() === "") {
    return res.status(400).json({
      message: "New folder name is required",
    });
  }

  const query =
    "UPDATE folders SET folder_name = ? WHERE id = ? AND user_id = ?";

  db.query(query, [new_name.trim(), folderId, userId], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Rename failed",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Folder not found",
      });
    }

    res.json({ message: "Folder renamed" });
  });
};

// ================= DELETE (SOFT DELETE) =================
export const deleteFolder = (req, res) => {
  const folderId = req.params.id;
  const userId = req.user.id;

  const query =
    "UPDATE folders SET is_deleted = TRUE WHERE id = ? AND user_id = ?";

  db.query(query, [folderId, userId], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Delete failed",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Folder not found",
      });
    }

    res.json({ message: "Folder moved to trash" });
  });
};

// ================= GET TRASH =================
export const getTrashFolders = (req, res) => {
  const userId = req.user.id;

  const query =
    "SELECT * FROM folders WHERE user_id = ? AND is_deleted = TRUE";

  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "DB error",
        error: err.message,
      });
    }

    res.json(results);
  });
};

// ================= RESTORE =================
export const restoreFolder = (req, res) => {
  const folderId = req.params.id;
  const userId = req.user.id;

  const query =
    "UPDATE folders SET is_deleted = FALSE WHERE id = ? AND user_id = ?";

  db.query(query, [folderId, userId], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Restore failed",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Folder not found",
      });
    }

    res.json({ message: "Folder restored" });
  });
};

// ================= PERMANENT DELETE =================
export const permanentDeleteFolder = (req, res) => {
  const folderId = req.params.id;
  const userId = req.user.id;

  const query =
    "DELETE FROM folders WHERE id = ? AND user_id = ?";

  db.query(query, [folderId, userId], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Delete failed",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Folder not found",
      });
    }

    res.json({ message: "Folder permanently deleted" });
  });
};

// ================= EMPTY TRASH (FIXED 🔥) =================
export const emptyTrashFolders = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Get all deleted folders
    const [folders] = await db.promise().query(
      "SELECT id FROM folders WHERE user_id=? AND is_deleted=TRUE",
      [userId]
    );

    // 2. Delete ALL trash files first
    await db.promise().query(
      "DELETE FROM files WHERE user_id=? AND is_deleted=TRUE",
      [userId]
    );

    // 3. Delete folders (child → parent safe)
    for (let i = folders.length - 1; i >= 0; i--) {
      await db.promise().query(
        "DELETE FROM folders WHERE id=? AND user_id=?",
        [folders[i].id, userId]
      );
    }

    res.json({ message: "Trash emptied successfully ✅" });
  } catch (err) {
    console.error("Empty Trash Error:", err);
    res.status(500).json({ message: "Failed to empty trash ❌" });
  }
};