const categoryModel = require("../models/category.model");
const imageService = require("./image.service");
const ApiError = require("../utils/ApiError");

const getAll = () => categoryModel.findAll();

const getNewest = () => categoryModel.findNewest();

const getById = async (categoryId) => {
  const category = await categoryModel.findById(categoryId);
  if (!category) throw ApiError.notFound("القسم غير موجود");
  return category;
};

const create = async ({ data, image, userId }) => {
  
  if (!image) throw ApiError.badRequest("صورة القسم مطلوبة");
  return categoryModel.create({
    title: data.title,
    description: data.description || null,
    image: await imageService.uploadImage(image),
    clerkId: userId,
  });
};

const update = async (categoryId, data) => {
  await getById(categoryId);
  return categoryModel.update(categoryId, data);
};

const updateImage = async (categoryId, image) => {
  if (!image) throw ApiError.badRequest("صورة القسم مطلوبة");

  const category = await getById(categoryId);
  const updated = await categoryModel.update(categoryId, {
    image: await imageService.uploadImage(image),
  });
  await imageService.deleteImage(category.image);
  return updated;
};

const remove = async (categoryId) => {
  const category = await getById(categoryId);
  await categoryModel.remove(categoryId);
  await imageService.deleteImage(category.image);
};

module.exports = { getAll, getNewest, getById, create, update, updateImage, remove };
