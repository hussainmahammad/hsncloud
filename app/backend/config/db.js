import mysql from "mysql2";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// Read SSL certificate (downloaded from AWS)
const sslCert = fs.readFileSync("./global-bundle.pem");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 3306,
  ssl: {
    ca: sslCert,
  },
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
    process.exit(1);
  }
  console.log("✅ RDS MySQL Connected");
});

export default db;