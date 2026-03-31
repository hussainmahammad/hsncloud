import jwt from "jsonwebtoken";

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
  try {
    // 1. Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    // Format: Bearer TOKEN
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Invalid token format",
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach user to request
    req.user = decoded;

    next(); // move to next middleware/controller
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
      error: error.message,
    });
  }
};

export default authMiddleware;