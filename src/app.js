const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { clerkMiddleware } = require("@clerk/express");
const config = require("./config");
const routes = require("./routes");
const { notFound, errorHandler } = require("./middlewares/error.middleware");

const app = express();

app.use(helmet());
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (config.env === "development") app.use(morgan("dev"));

// Reads the Clerk session token so getAuth(req) works in auth.middleware.
app.use(clerkMiddleware());

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
