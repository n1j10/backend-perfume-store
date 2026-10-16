const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const config = require("../config");
const paymentService = require("../services/payment.service");

// QiCard sends the user's browser here after the payment page.
const callback = asyncHandler(async (req, res) => {
  const { paymentId, orderId } = req.query;
  const isSuccess = await paymentService.isSuccessful(paymentId);

  const resultUrl = new URL("/payment-result", config.clientUrl);
  resultUrl.searchParams.set("status", isSuccess ? "success" : "failed");
  if (paymentId) resultUrl.searchParams.set("paymentId", paymentId);
  if (orderId) resultUrl.searchParams.set("orderId", orderId);

  res.redirect(resultUrl.toString());
});

// QiCard calls this server-to-server and expects 200 OK.
const webhook = asyncHandler(async (req, res) => {
  await paymentService.handleWebhook(req.body, req.get("x-signature"));
  sendSuccess(res, 200, { received: true });
});

module.exports = { callback, webhook };
