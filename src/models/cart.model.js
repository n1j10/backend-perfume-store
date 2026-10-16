const { prisma } = require("../config/db");

const includeCartItems = {
  cartItems: {
    include: {
      product: true
    },
    orderBy: { createdAt: "asc" }
  }
};

const findByUser = (clerkId) =>
  prisma.cart.findFirst({
    where: { clerkId },
    include: includeCartItems
  });

const create = (clerkId) =>
  prisma.cart.create({
    data: { clerkId },
    include: includeCartItems
  });

const countItems = (clerkId) =>
  prisma.cart.findFirst({
    where: { clerkId },
    select: {
      numItemsInCart: true
    }
  });

const updateTotals = (cartId, totals) =>
  prisma.cart.update({
    where: { id: cartId },
    data: totals,
    include: includeCartItems
  });

const findItems = (cartId) =>
  prisma.cartItem.findMany({
    where: { cartId },
    include: { product: true },
    orderBy: { createdAt: "asc" },
  });

const findItem = (cartId, productId) =>
  prisma.cartItem.findFirst({
    where: {
      cartId,
      productId
    }
  });

const createItem = (data) => prisma.cartItem.create({ data });

const updateItem = (id, cartId, data) => prisma.cartItem.update({
  where: {
    id,
    cartId
  },
  data
});

const removeItem = (id, cartId) => prisma.cartItem.delete({
  where: { id, cartId }
});

module.exports = {
  findByUser,
  create,
  countItems,
  updateTotals,
  findItems,
  findItem,
  createItem,
  updateItem,
  removeItem,
};
