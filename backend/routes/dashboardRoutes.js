import express from 'express';
import { getDashboardData } from '../controllers/dashboardController.js';
import { protect, vendor } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, vendor, getDashboardData);

export default router;
