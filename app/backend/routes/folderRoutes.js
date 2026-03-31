import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  createFolder,
  getFolders,
  renameFolder,
  deleteFolder,
  getTrashFolders,
  restoreFolder,
  permanentDeleteFolder,
  emptyTrashFolders, // ✅ NEW
} from "../controllers/folderController.js";

const router = express.Router();

// Create folder
router.post("/", authMiddleware, createFolder);

// Get folders
router.get("/", authMiddleware, getFolders);

// Rename
router.put("/rename/:id", authMiddleware, renameFolder);

// Delete (soft)
router.delete("/:id", authMiddleware, deleteFolder);

// Trash
router.get("/trash", authMiddleware, getTrashFolders);

// 🔥 EMPTY TRASH (NEW)
router.delete("/trash/empty", authMiddleware, emptyTrashFolders);

// Restore
router.put("/restore/:id", authMiddleware, restoreFolder);

// Permanent delete
router.delete("/permanent/:id", authMiddleware, permanentDeleteFolder);

export default router;