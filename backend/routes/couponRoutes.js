import express from 'express';
import {
  getCoupons,
  createCoupon,
  validateCoupon,
  deleteCoupon,
} from '../controllers/couponController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, admin, getCoupons).post(protect, admin, createCoupon);
router.route('/validate').post(protect, validateCoupon);
router.route('/:id').delete(protect, admin, deleteCoupon);

export default router;
