import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getCart)
  .post(protect, addToCart)
  .put(protect, updateCartItem);

router.route('/:productId')
  .delete(protect, removeFromCart);

export default router;
