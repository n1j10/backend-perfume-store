const { prisma } = require("../config/db");

const SUCCESS = "SUCCESS";

const create = (data) => prisma.qiCardPayment.create({ data });

const update = (id, data) => prisma.qiCardPayment.update({
  where: { id },
  data
});

const findByPaymentId = (paymentId) => prisma.qiCardPayment.findUnique({
  where: { paymentId }
});

// A payment page that was already opened for this order and is still waiting.
const findPending = (orderId) =>
  prisma.qiCardPayment.findFirst({
    where: { orderId, status: "CREATED", formUrl: { not: null } },
    orderBy: { createdAt: "desc" },
  });

// One transaction, so the order is never marked as paid twice.
// On success: mark the order as paid and delete the cart that was bought.
const settle = (paymentId, { status, details }) =>
  prisma.$transaction(
    async (tx) => {
      const payment = await tx.qiCardPayment.findUnique({ where: { paymentId } });
      if (!payment || payment.status === SUCCESS) return payment;

      await tx.qiCardPayment.update({
        where: { id: payment.id },
        data: {
          status,
          details,
          maskedPan: details?.maskedPan ?? payment.maskedPan,
          paymentSystem: details?.paymentSystem ?? payment.paymentSystem,
        },
      });

      if (status === SUCCESS) {
        await tx.order.update({ where: { id: payment.orderId }, data: { isPaid: true } });

        if (payment.cartId) {
          await tx.cart.deleteMany({ where: { id: payment.cartId } });
        }
      }

      return payment;
    },
    { isolationLevel: "Serializable" },
  );

const createWebhookEvent = (data) => prisma.qiCardWebhookEvent.create({ data });

const updateWebhookEvent = (id, data) => prisma.qiCardWebhookEvent.update({
  where: { id },
  data
});

module.exports = {
  SUCCESS,
  create,
  update,
  findByPaymentId,
  findPending,
  settle,
  createWebhookEvent,
  updateWebhookEvent,
};
