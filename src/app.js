const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { clerkMiddleware } = require("@clerk/express");
const config = require("./config");
const routes = require("./routes");
const { notFound, errorHandler } = require("./middlewares/error.middleware");

const rateLimit = require("./middlewares/rateLimit.middleware");

const app = express();

// Behind Vercel's proxy: use X-Forwarded-For for req.ip (rate limiting).
app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(helmet());
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
if (config.env === "development") app.use(morgan("dev"));

// Reads the Clerk session token so getAuth(req) works in auth.middleware.
app.use(clerkMiddleware());

app.get("/", (req, res) => res.json({ status: "ok", api: "/api", health: "/api/health" }));

// Global safety net against abuse: 300 requests / minute per IP.
app.use("/api", rateLimit({ windowMs: 60 * 1000, max: 300 }), routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
