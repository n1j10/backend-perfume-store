const express = require("express");
const controller = require("../controllers/user.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/me", authenticate, controller.getMe);

module.exports = router;
