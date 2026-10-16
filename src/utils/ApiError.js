class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = "طلب غير صالح") {
    return new ApiError(400, message);
  }

  static unauthorized(message = "غير مصرح") {
    return new ApiError(401, message);
  }

  static forbidden(message = "غير مسموح") {
    return new ApiError(403, message);
  }

  static notFound(message = "غير موجود") {
    return new ApiError(404, message);
  }

  static conflict(message = "موجود مسبقًا") {
    return new ApiError(409, message);
  }

  static badGateway(message = "خطأ في بوابة الدفع") {
    return new ApiError(502, message);
  }
}

module.exports = ApiError;
