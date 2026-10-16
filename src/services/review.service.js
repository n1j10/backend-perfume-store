const reviewModel = require("../models/review.model");
const productService = require("./product.service");
const userService = require("./user.service");

// Port of creatReviewAction(). Author name and image come from Clerk, not from the request.
const create = async (userId, { productId, rating, comment }) => {
  await productService.getById(productId);
  const author = await userService.getProfile(userId);

  return reviewModel.create({
    productId,
    rating,
    comment,
    clerkId: userId,
    authorName: author.fullName,
    authorImageUrl: author.imageUrl,
  });
};

const getByProduct = async (productId) => {
  await productService.getById(productId);
  return reviewModel.findByProduct(productId);
};

const getAll = () => reviewModel.findAll();

module.exports = { create, getByProduct, getAll };
