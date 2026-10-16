require("dotenv").config();

const config = {
  env: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  databaseUrl: process.env.DATABASE_URL,
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  serverUrl: (process.env.SERVER_URL || "http://localhost:5000").replace(/\/$/, ""),
  adminUserId: process.env.ADMIN_USER_ID,
  uploads: {
    maxFileSize: 1024 * 1024, // 1 MB, same limit as the Next.js imageSchema
  },
  storage: {
    endpoint: process.env.AWS_ENDPOINT_URL_S3?.replace(/\/$/, ""),
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucket: process.env.NEON_STORAGE_BUCKET || "book-store-images",
  },
  qicard: {
    baseUrl: (process.env.QICARD_BASE_URL || "https://uat-sandbox-3ds-api.qi.iq/api/v1").replace(/\/$/, ""),
    username: process.env.QICARD_USERNAME,
    password: process.env.QICARD_PASSWORD,
    terminalId: process.env.QICARD_TERMINAL_ID,
    publicKey: process.env.QICARD_PUBLIC_KEY?.trim(),
  },
};

const required = ["DATABASE_URL", "CLERK_PUBLISHABLE_KEY", "CLERK_SECRET_KEY", "ADMIN_USER_ID"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  throw new Error(`Missing environment variables: ${missing.join(", ")}`);
}

module.exports = config;
