const orderModel = require("../models/order.model");
const productService = require("./product.service");
const cartService = require("./cart.service");
const paymentService = require("./payment.service");
const ApiError = require("../utils/ApiError");

// "Buy now": an order for one product.
const createForProduct = async (userId, productId) => {
  const product = await productService.getById(productId);
  const order = await orderModel.create({
    clerkId: userId,
    productId: product.id,
    products: 1,
    orderTotal: product.price,
  });
  return { order, cartId: undefined };
};

// The schema links an order to one product, so a cart order points to
// the first item and holds the total of the whole cart.
const createFromCart = async (userId) => {
  const cart = await cartService.getOrCreateCart(userId, { errorOnFailure: true });
  const currentCart = await cartService.recalculateTotals(cart);
  if (currentCart.cartItems.length === 0) throw ApiError.badRequest("سلة التسوق فارغة");
  const order = await orderModel.create({
    clerkId: userId,
    productId: currentCart.cartItems[0].productId,
    products: currentCart.numItemsInCart,
    orderTotal: currentCart.orderTotal,
  });
  return { order, cartId: currentCart.id };
};

// Port of createOrderAction(). If QiCard is down the order is still saved,
// and the user can pay later with POST /orders/:id/pay.
const create = async (userId, productId) => {
  const { order, cartId } = productId ? await createForProduct(userId, productId)
    : await createFromCart(userId);
  let paymentUrl = null;
  try {
    paymentUrl = await paymentService.startCheckout({ userId, orderId: order.id, cartId });
  } catch (error) {
    console.error("QiCard checkout failed:", error.message);
  }
  return { order, paymentUrl };
};

// Port of payOrderAction().
const pay = (userId, orderId) => paymentService.startCheckout({ userId, orderId });

const getMine = (userId) => orderModel.findByUser(userId);

const getAll = () => orderModel.findAll();

module.exports = { create, pay, getMine, getAll };
