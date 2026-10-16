const productModel = require("../models/product.model");
const categoryService = require("./category.service");
const imageService = require("./image.service");
const ApiError = require("../utils/ApiError");

const getFeatured = () => productModel.findFeatured();

const getAll = ({ search, categoryId }) => productModel.findMany({ search, categoryId });

const getById = async (productId) => {
  const product = await productModel.findById(productId);
  if (!product) throw ApiError.notFound("المنتج غير موجود");
  return product;
};

// Port of fetchAdminPosts(): the products created by the admin.
const getMine = (userId) => productModel.findByOwner(userId);

const create = async ({ data, image, userId }) => {
  if (!image) throw ApiError.badRequest("صورة المنتج مطلوبة");

  await categoryService.getById(data.categoryId);

  return productModel.create({
    ...data,
    image: await imageService.uploadImage(image),
    clerkId: userId,
  });
};

const update = async (productId, data) => {
  await getById(productId);
  if (data.categoryId) await categoryService.getById(data.categoryId);
  return productModel.update(productId, data);
};

const updateImage = async (productId, image) => {
  if (!image) throw ApiError.badRequest("صورة المنتج مطلوبة");
  const product = await getById(productId);
  const updated = await productModel.update(productId, {
    image: await imageService.uploadImage(image),
  });
  await imageService.deleteImage(product.image);
  return updated;
};

const remove = async (productId) => {
  const product = await getById(productId);
  await productModel.remove(productId);
  await imageService.deleteImage(product.image);
};

module.exports = { getFeatured, getAll, getById, getMine, create, update, updateImage, remove };
