const multer = require("multer");
const config = require("../config");
const ApiError = require("../utils/ApiError");

// Files stay in memory, then image.service sends them to Neon Storage.
// Same rules as the Next.js imageSchema: images only, max 1 MB.
// Explicit allowlist: "image/*" would also accept SVG, which can carry JavaScript (stored XSS).
const ALLOWED_IMAGE_TYPES = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
};

const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.uploads.maxFileSize },
  fileFilter: (req, file, cb) => {
    if (!Object.hasOwn(ALLOWED_IMAGE_TYPES, file.mimetype)) {
      return cb(ApiError.badRequest("يجب أن يكون الملف صورة"));
    }
    cb(null, true);
  },
}).single("image");

/** File extension chosen by the server from the validated MIME type (never from the client filename). */
const extensionFor = (mimetype) => ALLOWED_IMAGE_TYPES[mimetype] || "";

module.exports = { uploadImage, extensionFor };
