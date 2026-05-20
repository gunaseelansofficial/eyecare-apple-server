const express = require('express');
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router
    .route('/')
    .get(getProducts)
    .post(protect, authorize('Admin'), createProduct);

router
    .route('/:id')
    .get(getProduct)
    .put(protect, authorize('Admin'), updateProduct)
    .delete(protect, authorize('Admin'), deleteProduct);

module.exports = router;
