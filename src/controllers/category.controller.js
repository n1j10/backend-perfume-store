const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const categoryService = require("../services/category.service");

const getAll = asyncHandler(async (req, res) => {
  const categories = await categoryService.getAll();
  sendSuccess(res, 200, categories);
});

const getNewest = asyncHandler(async (req, res) => {
  const categories = await categoryService.getNewest();
  sendSuccess(res, 200, categories);
});

const getOne = asyncHandler(async (req, res) => {
  const category = await categoryService.getById(req.params.id);
  sendSuccess(res, 200, category);
});

const create = asyncHandler(async (req, res) => {
  const category = await categoryService.create({
    data: req.body,
    image: req.file,
    userId: req.user.id,
  });
  sendSuccess(res, 201, category, "تم إنشاء القسم");
});

const update = asyncHandler(async (req, res) => {
  const category = await categoryService.update(req.params.id, req.body);
  sendSuccess(res, 200, category, "تم تحديث القسم");
});

const updateImage = asyncHandler(async (req, res) => {
  const category = await categoryService.updateImage(req.params.id, req.file);
  sendSuccess(res, 200, category, "تم تحديث صورة القسم");
});

const remove = asyncHandler(async (req, res) => {
  await categoryService.remove(req.params.id);
  sendSuccess(res, 200, null, "تم حذف القسم");
});

module.exports = { getAll, getNewest, getOne, create, update, updateImage, remove };
