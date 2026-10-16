const { prisma } = require("../config/db");

const findAll = () =>
  prisma.category.findMany({
    include: { products: true },
    orderBy: { title: "asc" },
  });

const findNewest = () =>
  prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });

const findById = (id) => prisma.category.findUnique({ 
  where: { id } 
});

const create = (data) => prisma.category.create({ data });

const update = (id, data) => prisma.category.update({
  where: { id },
  data
});

const remove = (id) => prisma.category.delete({ where: { id } });

module.exports = { findAll, findNewest, findById, create, update, remove };
