const express = require("express");
const controller = require("../controllers/order.controller");
const validate = require("../middlewares/validate.middleware");
const { authenticate, requireAdmin } = require("../middlewares/auth.middleware");
const { createOrderSchema } = require("../validations/order.validation");

const router = express.Router();

router.use(authenticate);
router.post("/", validate(createOrderSchema), controller.create);
router.get("/", controller.getMine);
router.post("/:id/pay", controller.pay);
router.get("/all", requireAdmin, controller.getAll);

module.exports = router;
