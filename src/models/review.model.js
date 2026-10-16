const { prisma } = require("../config/db");

const create = (data) => prisma.review.create({ data });

const findByProduct = (productId) =>
  prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
  });

const findAll = () =>
  prisma.review.findMany({
    include: {
      product: {
        select: {
          id: true, name: true
        }
      }
    },
    orderBy: { createdAt: "desc" },
  });

module.exports = { create, findByProduct, findAll };
