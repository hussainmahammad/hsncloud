import s3 from "../config/s3.js";

// ================= UPLOAD FILE =================
export const uploadToS3 = async (file) => {
  try {
    // ✅ clean filename (avoid encoding issues)
    const cleanName = file.originalname.replace(/\s+/g, "_");
    const fileKey = `${Date.now()}-${cleanName}`;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await s3.upload(params).promise();

    return fileKey;
  } catch (error) {
    throw new Error("S3 upload failed: " + error.message);
  }
};

// ================= DELETE FILE =================
export const deleteFromS3 = async (fileKey) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey, // ❗ no decode
    };

    await s3.deleteObject(params).promise();

    return true;
  } catch (error) {
    throw new Error("S3 delete failed: " + error.message);
  }
};

// ================= GET SIGNED URL =================
export const getSignedUrl = (fileKey, expires = 60 * 5) => {
  try {
    return s3.getSignedUrl("getObject", {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey, // ❗ no decode, no attachment forcing
      Expires: expires,
    });
  } catch (error) {
    throw new Error("Signed URL failed: " + error.message);
  }
};