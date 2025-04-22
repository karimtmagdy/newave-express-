const { Category } = require("../schema/Category");
const { AppError } = require("../middlewares/errorHandler");
const { fn, paginate } = require("../utils/utils");

exports.createCategory = fn(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({
    message: "category created successfully",
    status: "success",
    category,
  });
});

exports.getAllCategories = fn(async (req, res) => {
  // const categories = await Category.find({});
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const result = await paginate(Category, req.query, page, limit, {
    isActive: true,
  });
  result.categories = result.data;
  delete result.data;
  res.status(200).json(result);
});

exports.getCategoryById = fn(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new AppError("Category not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: category,
  });
});

exports.updateCategory = fn(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) {
    return next(new AppError("Category not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: category,
  });
});

exports.deleteCategory = fn(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return next(new AppError("Category not found", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
