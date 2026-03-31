import db from "../config/db.js";

// ================= MOVE FILE =================
export const moveFile = (req, res) => {
  const fileId = req.params.id;

  // ✅ accept multiple keys (frontend safe)
  const folder_id =
    req.body.folder_id ??
    req.body.folderId ??
    req.body.targetFolderId ??
    null;

  const userId = req.user.id;

  const query =
    "UPDATE files SET folder_id = ? WHERE id = ? AND user_id = ?";

  db.query(query, [folder_id, fileId, userId], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Move file failed",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    res.json({
      message: "File moved successfully",
    });
  });
};

// ================= MOVE FOLDER =================
export const moveFolder = (req, res) => {
  const folderId = req.params.id;

  // ✅ accept multiple keys (frontend safe)
  const parent_id =
    req.body.parent_id ??
    req.body.folderId ??
    req.body.targetFolderId ??
    null;

  const userId = req.user.id;

  // 🚨 Prevent moving folder into itself
  if (parseInt(folderId) === parseInt(parent_id)) {
    return res.status(400).json({
      message: "Cannot move folder into itself",
    });
  }

  const query =
    "UPDATE folders SET parent_id = ? WHERE id = ? AND user_id = ?";

  db.query(query, [parent_id, folderId, userId], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Move folder failed",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Folder not found",
      });
    }

    res.json({
      message: "Folder moved successfully",
    });
  });
};