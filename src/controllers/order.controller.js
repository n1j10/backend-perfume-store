const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const orderService = require("../services/order.service");

const create = asyncHandler(async (req, res) => {
  const result = await orderService.create(req.user.id, req.body.productId);
  const message = result.paymentUrl
    ? "Order created, continue to payment"
    : "Order created, but payment could not start. Try again from your orders";
  sendSuccess(res, 201, result, message);
});

const pay = asyncHandler(async (req, res) => {
  const paymentUrl = await orderService.pay(req.user.id, req.params.id);
  sendSuccess(res, 200, { paymentUrl }, "المتابعة إلى الدفع");
});

const getMine = asyncHandler(async (req, res) => {
  const orders = await orderService.getMine(req.user.id);
  sendSuccess(res, 200, orders);
});

const getAll = asyncHandler(async (req, res) => {
  const orders = await orderService.getAll();
  sendSuccess(res, 200, orders);
});

module.exports = { create, pay, getMine, getAll };
