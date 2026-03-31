import db from "../config/db.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import { generateToken } from "../utils/generateToken.js";
import crypto from "crypto";
import ses from "../config/ses.js";

// ================= REGISTER =================
export const registerUser = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  try {
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const checkQuery = "SELECT * FROM users WHERE email = ?";

    db.query(checkQuery, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({
          message: "Database error",
          error: err.message,
        });
      }

      if (results.length > 0) {
        return res.status(400).json({
          message: "User already exists",
        });
      }

      const hashedPassword = await hashPassword(password);
      const verificationToken = crypto.randomBytes(32).toString("hex");

      // ✅ SES verification trigger
      try {
        await ses.verifyEmailIdentity({
          EmailAddress: email,
        }).promise();
      } catch (e) {
        console.log("SES trigger error:", e.message);
      }

      const now = new Date();
      const expiry = new Date(now.getTime() + 5 * 60 * 1000);

      const insertQuery = `
        INSERT INTO users 
        (first_name, last_name, email, password, verification_token, is_verified,
         ses_status, ses_requested_at, ses_expiry_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(
        insertQuery,
        [
          first_name,
          last_name,
          email,
          hashedPassword,
          verificationToken,
          false,
          "Pending",
          now,
          expiry,
        ],
        (err) => {
          if (err) {
            return res.status(500).json({
              message: "Error creating user",
              error: err.message,
            });
          }

          return res.status(201).json({
            message:
              "SES verification email sent. Please verify to receive app verification email.",
          });
        }
      );
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ================= VERIFY EMAIL =================
export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) return res.send("Invalid link");

  db.query(
    "SELECT * FROM users WHERE verification_token=?",
    [token],
    async (err, results) => {
      if (err) return res.send("Database error");

      if (results.length === 0) {
        return res.send("Invalid or expired link");
      }

      const user = results[0];

      db.query(
        "UPDATE users SET is_verified=true, verification_token=NULL WHERE id=?",
        [user.id],
        async (err) => {
          if (err) return res.send("Error verifying");

          // ✅ FINAL EMAIL AFTER APP VERIFICATION
          try {
            await ses.sendEmail({
              Source: process.env.SES_EMAIL,
              Destination: { ToAddresses: [user.email] },
              Message: {
                Subject: { Data: "HSN Cloud - Account Activated" },
                Body: {
                  Html: {
                    Data: `
                    <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
</head>
<body style="margin:0; padding:0; background:#f4f6f8; font-family:Arial, sans-serif;">

  <div style="padding:40px 0;">
    <div style="max-width:520px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden; border:1px solid #e5e7eb;">

      <!-- Header -->
      <div style="text-align:center; padding:30px 20px;">
        <h1 style="margin:0; font-size:22px; color:#2563eb; font-weight:600;">
          HSN Cloud
        </h1>
      </div>

      <!-- Divider -->
      <div style="height:1px; background:#e5e7eb;"></div>

      <!-- Content -->
      <div style="padding:30px; text-align:center;">

        <h2 style="margin:0 0 12px; color:#111827; font-size:20px; font-weight:600;">
          Account Activated
        </h2>

        <p style="color:#4b5563; font-size:14px; line-height:1.6; margin:0;">
          Your email has been successfully verified. Your HSN Cloud account is now active.
        </p>

        <div style="margin-top:20px;">
          <p style="color:#4b5563; font-size:14px; margin:0;">
            You can now log in and start using the platform.
          </p>
        </div>

        <!-- CTA Button -->
        <div style="margin-top:30px;">
          <a href="${process.env.APP_PUBLIC_URL}/login"
             style="display:inline-block; padding:12px 28px;
                    background:#2563eb; color:#ffffff;
                    text-decoration:none; border-radius:6px;
                    font-size:14px; font-weight:500;">
            Go to Login
          </a>
        </div>

      </div>

      <!-- Footer -->
      <div style="background:#f9fafb; padding:20px; text-align:center; font-size:12px; color:#6b7280;">
        <p style="margin:0;">
          Welcome to HSN Cloud.
        </p>
        <p style="margin-top:8px;">
          © 2026 HSN Cloud
        </p>
      </div>

    </div>
  </div>

</body>
</html>
                    `,
                  },
                },
              },
            }).promise();
          } catch (e) {
            console.log("Final email error:", e.message);
          }

          res.send(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Account Verified</title>
</head>
<body style="margin:0; padding:0; background:#f4f6f8; font-family:Arial, sans-serif;">

  <div style="display:flex; align-items:center; justify-content:center; height:100vh;">
    <div style="max-width:420px; width:100%; background:#ffffff; border-radius:10px; border:1px solid #e5e7eb; padding:40px; text-align:center;">

      <h1 style="color:#2563eb; margin-bottom:10px; font-size:22px;">
        HSN Cloud
      </h1>

      <h2 style="color:#111827; font-size:20px; margin-bottom:15px;">
        Email Verified Successfully
      </h2>

      <p style="color:#4b5563; font-size:14px; line-height:1.6;">
        Your account has been successfully verified. You can now log in and start using the platform.
      </p>

      <a href="${process.env.APP_PUBLIC_URL}/login"
         style="display:inline-block; margin-top:25px; padding:12px 28px;
                background:#2563eb; color:#ffffff;
                text-decoration:none; border-radius:6px;
                font-size:14px; font-weight:500;">
        Go to Login
      </a>

    </div>
  </div>

</body>
</html>
`);
        }
      );
    }
  );
};

// ================= LOGIN =================
export const loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password required",
    });
  }

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ message: "DB error" });

      if (results.length === 0) {
        return res.status(400).json({ message: "User not found" });
      }

      const user = results[0];

      const isMatch = await comparePassword(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
      }

      if (!user.ses_status || user.ses_status === "Pending") {
        return res.status(400).json({
          message:
            "Please verify your email from the verification link sent to your inbox",
        });
      }

      if (user.ses_status === "Expired") {
        return res.status(400).json({
          message: "Verification expired. Register again.",
        });
      }

      if (!user.is_verified) {
        return res.status(400).json({
          message: "Please verify your email first",
        });
      }

      const token = generateToken(user);

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
        },
      });
    }
  );
};

// ================= FORGOT PASSWORD =================
export const forgotPassword = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email required" });
  }

  db.query("SELECT * FROM users WHERE email=?", [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "DB error" });

    if (results.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = results[0];
    const token = crypto.randomBytes(32).toString("hex");

    db.query(
      "UPDATE users SET reset_token=?, reset_token_expiry=NOW() + INTERVAL 1 HOUR WHERE id=?",
      [token, user.id],
      async (err) => {
        if (err) return res.status(500).json({ message: "Error saving token" });

        try {
          const link = `${process.env.APP_PUBLIC_URL}/reset-password?token=${token}`;

          await ses.sendEmail({
            Source: process.env.SES_EMAIL,
            Destination: { ToAddresses: [email] },
            Message: {
              Subject: { Data: "Reset Password" },
              Body: {
Html: {
  Data: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
</head>
<body style="margin:0; padding:0; background:#f4f6f8; font-family:Arial, sans-serif;">

  <div style="padding:40px 0;">
    <div style="max-width:520px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden; border:1px solid #e5e7eb;">

      <!-- Header -->
      <div style="text-align:center; padding:30px 20px;">
        <h1 style="margin:0; font-size:22px; color:#2563eb; font-weight:600;">
          HSN Cloud
        </h1>
      </div>

      <!-- Divider -->
      <div style="height:1px; background:#e5e7eb;"></div>

      <!-- Content -->
      <div style="padding:30px; text-align:center;">

        <h2 style="margin:0 0 12px; color:#111827; font-size:20px; font-weight:600;">
          Reset Your Password
        </h2>

        <p style="color:#4b5563; font-size:14px; line-height:1.6; margin:0;">
          We received a request to reset your password. Click the button below to set a new password.
        </p>

        <!-- Button -->
        <div style="margin-top:30px;">
          <a href="${link}"
             style="display:inline-block; padding:12px 28px;
                    background:#2563eb; color:#ffffff;
                    text-decoration:none; border-radius:6px;
                    font-size:14px; font-weight:500;">
            Reset Password
          </a>
        </div>

        <!-- Backup link -->
        <p style="margin-top:25px; font-size:12px; color:#6b7280;">
          If the button does not work, use the link below:
        </p>

        <p style="word-break:break-all; font-size:12px; color:#2563eb; margin:0;">
          ${link}
        </p>

        <!-- Info -->
        <p style="margin-top:15px; font-size:12px; color:#9ca3af;">
          This link will expire in 1 hour.
        </p>

      </div>

      <!-- Footer -->
      <div style="background:#f9fafb; padding:20px; text-align:center; font-size:12px; color:#6b7280;">
        <p style="margin:0;">
          If you did not request a password reset, you can ignore this email.
        </p>
        <p style="margin-top:8px;">
          © 2026 HSN Cloud
        </p>
      </div>

    </div>
  </div>

</body>
</html>
  `,
},
              },
            },
          }).promise();

          res.json({ message: "Reset email sent" });
        } catch (e) {
          res.status(500).json({ message: "Email failed" });
        }
      }
    );
  });
};

// ================= RESET PASSWORD =================
export const resetPassword = (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: "Invalid request" });
  }

  db.query(
    "SELECT * FROM users WHERE reset_token=? AND reset_token_expiry > NOW()",
    [token],
    async (err, results) => {
      if (err) return res.status(500).json({ message: "DB error" });

      if (results.length === 0) {
        return res.status(400).json({
          message: "Invalid or expired token",
        });
      }

      const user = results[0];
      const hashedPassword = await hashPassword(password);

      db.query(
        "UPDATE users SET password=?, reset_token=NULL, reset_token_expiry=NULL WHERE id=?",
        [hashedPassword, user.id],
        (err) => {
          if (err) {
            return res.status(500).json({
              message: "Error updating password",
            });
          }

          res.json({ message: "Password reset successful" });
        }
      );
    }
  );
};