const multer = require("multer");
const config = require("../config");
const ApiError = require("../utils/ApiError");

const notFound = (req, res, next) => {
  next(ApiError.notFound(`المسار ${req.originalUrl} غير موجود`));
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "حدث خطأ في الخادم";

  if (error instanceof multer.MulterError) {
    statusCode = 400;
    message =
      error.code === "LIMIT_FILE_SIZE" ? "يجب أن يكون حجم الملف أقل من 1 ميغابايت" : error.message;
  }

  // Prisma: record not found / unique constraint / missing relation.
  if (error.code === "P2025") {
    statusCode = 404;
    message = "السجل غير موجود";
  }
  if (error.code === "P2002") {
    statusCode = 409;
    message = "السجل موجود مسبقًا";
  }
  if (error.code === "P2003") {
    statusCode = 400;
    message = "السجل المرتبط غير موجود";
  }

  if (statusCode === 500) console.error(error);

  res.status(statusCode).json({
    success: false,
    message,
    ...(config.env === "development" && { stack: error.stack }),
  });
};

module.exports = { notFound, errorHandler };
