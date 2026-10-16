const express = require("express");
const controller = require("../controllers/review.controller");
const validate = require("../middlewares/validate.middleware");
const { authenticate } = require("../middlewares/auth.middleware");
const { reviewSchema } = require("../validations/review.validation");

const router = express.Router();

router.get("/", controller.getAll);
router.get("/product/:productId", controller.getByProduct);
router.post("/", authenticate, validate(reviewSchema), controller.create);

module.exports = router;
