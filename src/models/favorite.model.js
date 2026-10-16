const { prisma } = require("../config/db");

const findOne = (clerkId, productId) =>
  prisma.favorite.findFirst({
    where: {
      clerkId,
      productId
    },
    select: { id: true }
  });

const findByUser = (clerkId) =>
  prisma.favorite.findMany({
    where: { clerkId },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

const create = (clerkId, productId) => prisma.favorite.create({
  data: {
    clerkId,
    productId
  }
});

const remove = (id) => prisma.favorite.delete({
  where: { id }
});

module.exports = { findOne, findByUser, create, remove };
