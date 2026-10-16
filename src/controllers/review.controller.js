const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const reviewService = require("../services/review.service");

const create = asyncHandler(async (req, res) => {
  const review = await reviewService.create(req.user.id, req.body);
  sendSuccess(res, 201, review, "تم إرسال التقييم");
});

const getByProduct = asyncHandler(async (req, res) => {
  const reviews = await reviewService.getByProduct(req.params.productId);
  sendSuccess(res, 200, reviews);
});

const getAll = asyncHandler(async (req, res) => {
  const reviews = await reviewService.getAll();
  sendSuccess(res, 200, reviews);
});

module.exports = { create, getByProduct, getAll };
