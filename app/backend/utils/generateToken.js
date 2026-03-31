import jwt from "jsonwebtoken";

// Generate JWT token
export const generateToken = (user) => {
  try {
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return token;
  } catch (error) {
    throw new Error("Error generating token");
  }
};