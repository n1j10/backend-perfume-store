const { getAuth } = require("@clerk/express");
const config = require("../config");
const ApiError = require("../utils/ApiError");

// Replaces getAuthUser(). clerkMiddleware() in app.js reads "Authorization: Bearer <token>".
const authenticate = (req, res, next) => {
  const { userId } = getAuth(req);
  if (!userId) return next(ApiError.unauthorized("يجب تسجيل الدخول أولًا"));

  req.user = { id: userId };
  next();
};

// Replaces getAdminUser().
const requireAdmin = (req, res, next) => {
  if (req.user.id !== config.adminUserId) {
    return next(ApiError.forbidden("هذه الصفحة للمشرفين فقط"));
  }
  next();
};

// For endpoints that work with or without a user (e.g. cart count, favorite status).
const optionalAuth = (req, res, next) => {
  const { userId } = getAuth(req);
  if (userId) req.user = { id: userId };
  next();
};

module.exports = { authenticate, requireAdmin, optionalAuth };
