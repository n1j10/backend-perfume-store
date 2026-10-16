const express = require("express");
const controller = require("../controllers/category.controller");
const validate = require("../middlewares/validate.middleware");
const { authenticate, requireAdmin } = require("../middlewares/auth.middleware");
const { uploadImage } = require("../middlewares/upload.middleware");
const { categorySchema, updateCategorySchema } = require("../validations/category.validation");

const router = express.Router();

// Public
router.get("/", controller.getAll);

// Admin
router.get("/admin", authenticate, requireAdmin, controller.getNewest);
router.post(
  "/",
  authenticate,
  requireAdmin,
  uploadImage,
  validate(categorySchema),
  controller.create,
);
router.patch(
  "/:id",
  authenticate,
  requireAdmin,
  validate(updateCategorySchema),
  controller.update,
);
router.patch("/:id/image", authenticate, requireAdmin, uploadImage, controller.updateImage);
router.delete("/:id", authenticate, requireAdmin, controller.remove);

// Kept last so it does not swallow "/admin".
router.get("/:id", controller.getOne);

module.exports = router;
