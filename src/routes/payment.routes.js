const express = require("express");
const controller = require("../controllers/payment.controller");

const router = express.Router();

// Called by QiCard, not by the frontend.
router.get("/callback", controller.callback);
router.post("/webhook", controller.webhook);

module.exports = router;
