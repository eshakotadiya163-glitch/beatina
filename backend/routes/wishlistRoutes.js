import express from 'express';
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from '../controllers/wishlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getWishlist);
router.route('/:id').post(protect, addToWishlist).delete(protect, removeFromWishlist);

export default router;
