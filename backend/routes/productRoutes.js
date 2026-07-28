import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductsByCategory,
} from '../controllers/productController.js';
import { protect, admin, vendor } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, vendor, createProduct);
router.route('/:id/reviews').post(protect, createProductReview);
router.route('/category/:slug').get(getProductsByCategory);
router
  .route('/:id')
  .get(getProductById)
  .put(protect, vendor, updateProduct)
  .delete(protect, vendor, deleteProduct);

export default router;
