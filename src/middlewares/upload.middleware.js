const multer = require("multer");
const config = require("../config");
const ApiError = require("../utils/ApiError");

// Files stay in memory, then image.service sends them to Neon Storage.
// Same rules as the Next.js imageSchema: images only, max 1 MB.
const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.uploads.maxFileSize },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(ApiError.badRequest("يجب أن يكون الملف صورة"));
    }
    cb(null, true);
  },
}).single("image");

module.exports = { uploadImage };
