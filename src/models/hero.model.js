const { prisma } = require("../config/db");

const findAll = () =>
  prisma.hero.findMany({
    orderBy: { createdAt: "desc" },
  });

module.exports = { findAll };
