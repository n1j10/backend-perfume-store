// One response shape for the whole API.
const sendSuccess = (res, statusCode, data, message = "تمت العملية بنجاح") => {
  res.status(statusCode).json({ success: true, message, data });
};

module.exports = { sendSuccess };
