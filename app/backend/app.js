import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import folderRoutes from "./routes/folderRoutes.js";
import moveRoutes from "./routes/moveRoutes.js";
import shareRoutes from "./routes/shareRoutes.js";

dotenv.config();

const app = express();

// ================= MIDDLEWARES =================

// Enable CORS (you can restrict origin later)
app.use(cors());

// Parse JSON
app.use(express.json());

// ================= ROUTES =================

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/move", moveRoutes);
app.use("/api/share", shareRoutes);

// Public route for shared files (no auth)
app.use("/public", shareRoutes);

// ================= HEALTH CHECK =================

app.get("/", (req, res) => {
  res.send("API is working 🚀");
});

// ================= GLOBAL ERROR HANDLER =================

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    message: "Something went wrong",
    error: err.message,
  });
});

export default app;