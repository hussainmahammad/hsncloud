import bcrypt from "bcrypt";

// Hash password
export const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password");
  }
};

// Compare password
export const comparePassword = async (enteredPassword, storedPassword) => {
  try {
    const isMatch = await bcrypt.compare(
      enteredPassword,
      storedPassword
    );
    return isMatch;
  } catch (error) {
    throw new Error("Error comparing password");
  }
};