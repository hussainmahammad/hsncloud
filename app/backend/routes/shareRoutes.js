import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  generateShareLink,
  accessSharedFile,
} from "../controllers/shareController.js";

const router = express.Router();

// Generate share link (protected)
router.post("/:id", authMiddleware, generateShareLink);

// Public access (no auth)
router.get("/public/:token", accessSharedFile);

export default router;