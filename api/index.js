// Vercel serverless entry. Vercel calls this exported Express app for every request
// (see vercel.json). Prisma connects lazily on the first query, so no connectDB() here.
const app = require("../src/app");

module.exports = app;
