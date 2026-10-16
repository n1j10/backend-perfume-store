const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const productService = require("../services/product.service");

const getFeatured = asyncHandler(async (req, res) => {
  const products = await productService.getFeatured();
  sendSuccess(res, 200, products);
});

const getAll = asyncHandler(async (req, res) => {
  const products = await productService.getAll(req.query);
  sendSuccess(res, 200, products);
});

const getOne = asyncHandler(async (req, res) => {
  const product = await productService.getById(req.params.id);
  sendSuccess(res, 200, product);
});

const getMine = asyncHandler(async (req, res) => {
  const products = await productService.getMine(req.user.id);
  sendSuccess(res, 200, products);
});

const create = asyncHandler(async (req, res) => {
  const product = await productService.create({
    data: req.body,
    image: req.file,
    userId: req.user.id,
  });
  sendSuccess(res, 201, product, "تم إنشاء المنتج");
});

const update = asyncHandler(async (req, res) => {
  const product = await productService.update(req.params.id, req.body);
  sendSuccess(res, 200, product, "تم تحديث المنتج");
});

const updateImage = asyncHandler(async (req, res) => {
  const product = await productService.updateImage(req.params.id, req.file);
  sendSuccess(res, 200, product, "تم تحديث صورة المنتج");
});

const remove = asyncHandler(async (req, res) => {
  await productService.remove(req.params.id);
  sendSuccess(res, 200, null, "تم حذف المنتج");
});

module.exports = { getFeatured, getAll, getOne, getMine, create, update, updateImage, remove };
