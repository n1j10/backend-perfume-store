const { prisma } = require("../config/db");

const findFeatured = () => prisma.product.findMany({
  where: { featured: true }
});

const findMany = ({ search = "", categoryId } = {}) =>
  prisma.product.findMany({
    where: {
      ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
      ...(categoryId ? { categoryId } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

const findById = (id) =>
  prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

const findByOwner = (clerkId) =>
  prisma.product.findMany({
    where: { clerkId },
    orderBy: { createdAt: "desc" }
  });

const create = (data) => prisma.product.create({ data });

const update = (id, data) => prisma.product.update({
  where: { id },
  data
});

const remove = (id) => prisma.product.delete({
  where: { id }
});

module.exports = { findFeatured, findMany, findById, findByOwner, create, update, remove };
