const express = require("express");
const controller = require("../controllers/hero.controller");

const router = express.Router();

router.get("/", controller.getAll);

module.exports = router;
