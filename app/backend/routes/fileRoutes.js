import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  uploadFile,
  getFiles,
  deleteFile,
  getTrashFiles,
  restoreFile,
  permanentDeleteFile,
  renameFile,
  streamFile,
  downloadFile,
  emptyTrashFiles, // ✅ NEW
} from "../controllers/fileController.js";

const router = express.Router();

// ================= FILE ROUTES =================

// Upload file
router.post("/upload", authMiddleware, upload.single("file"), uploadFile);

// Get files (by folder or root)
router.get("/", authMiddleware, getFiles);

// Soft delete (move to trash)
router.delete("/:id", authMiddleware, deleteFile);

// Get trash files
router.get("/trash", authMiddleware, getTrashFiles);

// 🔥 EMPTY TRASH (NEW)
router.delete("/trash/empty", authMiddleware, emptyTrashFiles);

// Restore file
router.put("/restore/:id", authMiddleware, restoreFile);

// Permanent delete
router.delete("/permanent/:id", authMiddleware, permanentDeleteFile);

// Rename file
router.put("/rename/:id", authMiddleware, renameFile);

// ================= VIEW & DOWNLOAD (FIXED) =================

// ✅ Correct routes (NO extra /files)
router.get("/:id/view", authMiddleware, streamFile);
router.get("/:id/download", authMiddleware, downloadFile);

export default router;