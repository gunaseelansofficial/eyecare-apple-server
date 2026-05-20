const express = require('express');
const { getCategories, createCategory, deleteCategory, updateCategory } = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(getCategories)
    .post(protect, authorize('Admin'), createCategory);

router.route('/:id')
    .put(protect, authorize('Admin'), updateCategory)
    .delete(protect, authorize('Admin'), deleteCategory);

module.exports = router;
