import express from "express";
import {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

// ================= AUTH ROUTES =================

// Register user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Verify email
router.get("/verify-email", verifyEmail);

// 🔥 Forgot password
router.post("/forgot-password", forgotPassword);

// 🔥 Reset password
router.post("/reset-password", resetPassword);

export default router;