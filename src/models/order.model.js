const { prisma } = require("../config/db");

const productName = {
  select: {
    name: true
  }
};

const create = (data) => prisma.order.create({ data });

const findByUser = (clerkId) =>
  prisma.order.findMany({
    where: { clerkId },
    include: { product: productName },
    orderBy: { createdAt: "desc" }
  });

const findOneByUser = (id, clerkId) => prisma.order.findFirst({
  where: {
    id, clerkId
  }
});

const findAll = () => prisma.order.findMany({
  include: { product: productName },
  orderBy: { createdAt: "desc" }
});

module.exports = { create, findByUser, findOneByUser, findAll };
