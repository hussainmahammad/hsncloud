import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { moveFile, moveFolder } from "../controllers/moveController.js";

const router = express.Router();

// Move file
router.put("/file/:id", authMiddleware, moveFile);

// Move folder
router.put("/folder/:id", authMiddleware, moveFolder);

export default router;