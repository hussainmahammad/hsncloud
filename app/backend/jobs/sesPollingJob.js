import cron from "node-cron";
import db from "../config/db.js";
import ses from "../config/ses.js";

export const startSESPolling = () => {
  // every 1 minute
  cron.schedule("0 * * * * *", async () => {
    console.log("🔄 SES Polling running...");

    db.query(
      "SELECT * FROM users WHERE ses_status = 'Pending'",
      async (err, users) => {
        if (err) {
          console.log("DB error:", err.message);
          return;
        }

        const now = new Date();

        for (const user of users) {
          // ⛔ Expiry check
          if (user.ses_expiry_at && now > new Date(user.ses_expiry_at)) {
            console.log(`⛔ Expired: ${user.email}`);

            db.query(
              "UPDATE users SET ses_status='Expired' WHERE id=?",
              [user.id]
            );

            continue;
          }

          // 🔍 Check SES status
          try {
            const result = await ses
              .getIdentityVerificationAttributes({
                Identities: [user.email],
              })
              .promise();

            const status =
              result.VerificationAttributes?.[user.email]
                ?.VerificationStatus;

            // ✅ ONLY once after SES success
            if (status === "Success" && user.ses_status !== "Success") {
              console.log(`✅ SES Verified: ${user.email}`);

              // ✅ Update SES status
              db.query(
                "UPDATE users SET ses_status='Success' WHERE id=?",
                [user.id]
              );

              // ✅ Get public URL (single source of truth)
              const BASE_URL =
                process.env.APP_PUBLIC_URL || "http://localhost";

              // ✅ Generate verification link
              const link = `${BASE_URL}/api/auth/verify-email?token=${user.verification_token}`;

              // ✅ Clean professional email template
              const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
</head>
<body style="margin:0; padding:0; background:#f4f6f8; font-family:Arial, sans-serif;">

  <div style="padding:40px 0;">
    <div style="max-width:520px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden; border:1px solid #e5e7eb;">

      <div style="text-align:center; padding:30px 20px;">
        <h1 style="margin:0; font-size:22px; color:#2563eb; font-weight:600;">
          HSN Cloud
        </h1>
      </div>

      <div style="height:1px; background:#e5e7eb;"></div>

      <div style="padding:30px; text-align:center;">

        <h2 style="margin:0 0 12px; color:#111827; font-size:20px; font-weight:600;">
          Verify your email
        </h2>

        <p style="color:#4b5563; font-size:14px; line-height:1.6; margin:0;">
          Please confirm your email address to activate your account and start using HSN Cloud.
        </p>

        <div style="margin-top:30px;">
          <a href="${link}"
             style="display:inline-block; padding:12px 28px;
                    background:#2563eb; color:#ffffff;
                    text-decoration:none; border-radius:6px;
                    font-size:14px; font-weight:500;">
            Verify Account
          </a>
        </div>

        <p style="margin-top:25px; font-size:12px; color:#6b7280;">
          If the button does not work, use the link below:
        </p>

        <p style="word-break:break-all; font-size:12px; color:#2563eb; margin:0;">
          ${link}
        </p>

        <p style="margin-top:15px; font-size:12px; color:#9ca3af;">
          This link will expire in 5 minutes.
        </p>

      </div>

      <div style="background:#f9fafb; padding:20px; text-align:center; font-size:12px; color:#6b7280;">
        <p style="margin:0;">
          If you did not create an account, you can ignore this email.
        </p>
        <p style="margin-top:8px;">
          © 2026 HSN Cloud
        </p>
      </div>

    </div>
  </div>

</body>
</html>
              `;

              // ✅ Send email
              try {
                await ses
                  .sendEmail({
                    Source: process.env.SES_EMAIL,
                    Destination: { ToAddresses: [user.email] },
                    Message: {
                      Subject: { Data: "Verify your email - HSN Cloud" },
                      Body: {
                        Html: {
                          Data: htmlTemplate,
                        },
                      },
                    },
                  })
                  .promise();

                console.log(`📩 App verification email sent to ${user.email}`);
              } catch (emailErr) {
                console.log("Email send error:", emailErr.message);
              }
            }
          } catch (e) {
            console.log("SES check error:", e.message);
          }
        }
      }
    );
  });
};