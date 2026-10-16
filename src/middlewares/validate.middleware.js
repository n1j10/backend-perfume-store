const ApiError = require("../utils/ApiError");

// Zod equivalent of validateFuctionSchema(): validates one request part.
const validate = (schema, source = "body") => (req, res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    // Messages are written in Arabic and already name the field, so the path is not prepended.
    const messages = result.error.issues.map((issue) => issue.message);
    return next(ApiError.badRequest(messages.join("، ")));
  }

  req[source] = result.data;
  next();
};

module.exports = validate;
