const crypto = require("node:crypto");
const config = require("../config");
const paymentModel = require("../models/payment.model");
const orderModel = require("../models/order.model");
const qicardService = require("./qicard.service");
const userService = require("./user.service");
const ApiError = require("../utils/ApiError");

const getUnpaidOrder = async (userId, orderId) => {
  const order = await orderModel.findOneByUser(orderId, userId);
  if (!order) throw ApiError.notFound("الطلب غير موجود");
  if (order.isPaid) throw ApiError.conflict("تم دفع هذا الطلب مسبقًا");
  if (order.orderTotal <= 0) throw ApiError.badRequest("مبلغ الطلب غير صالح");
  return order;
};

// Port of startQiCardCheckout(): returns the QiCard page where the user enters the card.
const startCheckout = async ({ userId, orderId, cartId }) => {
  const order = await getUnpaidOrder(userId, orderId);

  const pending = await paymentModel.findPending(order.id);
  if (pending) return pending.formUrl;

  const requestId = `qi-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  const payment = await paymentModel.create({
    orderId: order.id,
    cartId,
    requestId,
    amount: order.orderTotal,
  });

  try {
    const { firstName, lastName, email } = await userService.getProfile(userId);

    const qiPayment = await qicardService.createPayment({
      requestId,
      amount: order.orderTotal,
      finishPaymentUrl: `${config.serverUrl}/api/payments/callback?orderId=${encodeURIComponent(order.id)}`,
      notificationUrl: `${config.serverUrl}/api/payments/webhook`,
      customerInfo: { firstName, lastName, email },
      additionalInfo: { orderId: order.id, cartId },
    });

    await paymentModel.update(payment.id, {
      paymentId: qiPayment.paymentId,
      formUrl: qiPayment.formUrl,
      status: qiPayment.status,
    });

    return qiPayment.formUrl;
  } catch (error) {
    await paymentModel.update(payment.id, { status: "FAILED", failureReason: error.message });
    throw error;
  }
};

// Never trust the status sent by the browser or the webhook body: always ask QiCard.
const confirm = async (paymentId) => {
  const qiPayment = await qicardService.getPaymentStatus(paymentId);
  const status = qiPayment.status.toUpperCase();

  const payment = await paymentModel.settle(paymentId, { status, details: qiPayment.details });
  if (!payment) throw ApiError.notFound("عملية الدفع غير موجودة");

  return status;
};

// Used by the callback: any problem simply means "failed" for the user.
const isSuccessful = async (paymentId) => {
  if (!paymentId) return false;

  try {
    return (await confirm(paymentId)) === paymentModel.SUCCESS;
  } catch (error) {
    console.error("QiCard callback verification failed:", error.message);
    return false;
  }
};

const handleWebhook = async (payload, signature) => {
  const paymentId = payload?.paymentId;
  if (typeof paymentId !== "string") throw ApiError.badRequest("معرّف الدفع مفقود");
  if (!qicardService.isValidSignature(payload, signature)) {
    throw ApiError.unauthorized("توقيع غير صالح");
  }

  const payment = await paymentModel.findByPaymentId(paymentId);
  const event = await paymentModel.createWebhookEvent({
    paymentId: payment?.id || null,
    status: payload.status || "RECEIVED",
    payload,
  });

  const status = await confirm(paymentId);

  await paymentModel.updateWebhookEvent(event.id, { status, processedAt: new Date() });
};

module.exports = { startCheckout, isSuccessful, handleWebhook };
