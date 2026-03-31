import multer from "multer";

// Store file in memory (not disk)
const storage = multer.memoryStorage();

// Optional: file size limit (e.g., 50MB)
const limits = {
  fileSize: 50 * 1024 * 1024, // 50 MB
};

// Optional: file filter (allow all for now)
const fileFilter = (req, file, cb) => {
  cb(null, true); // accept all files
};

const upload = multer({
  storage,
  limits,
  fileFilter,
});

export default upload;