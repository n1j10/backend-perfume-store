const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const heroModel = require("../models/hero.model");

// Slides for the home page carousel.
const getAll = asyncHandler(async (req, res) => {
  const heroes = await heroModel.findAll();
  sendSuccess(res, 200, heroes);
});

module.exports = { getAll };
