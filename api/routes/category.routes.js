const express = require("express");
const categoryController = require("../services/category.service");
const { isAdmin } = require("../middlewares/JWTauth");
const {
  validateCategory,
  validateCategoryId,
} = require("../validator/category.validate");

const router = express.Router();

// router.use(protect); // All routes require authentication
// router.use(isAdmin); // All routes require admin privileges

router
  .route("/")
  .post(isAdmin, validateCategory, categoryController.createCategory)
  .get(categoryController.getAllCategories);

router
  .route("/:id")
  .get(isAdmin, validateCategoryId, categoryController.getCategoryById)
  .put(
    isAdmin,
    validateCategoryId,
    validateCategory,
    categoryController.updateCategory
  )
  .delete(isAdmin, validateCategoryId, categoryController.deleteCategory);

module.exports = router;
