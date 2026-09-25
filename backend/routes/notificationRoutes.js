import express from 'express';
const router = express.Router();
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from '../controllers/notificationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(protect, admin, getNotifications);
router.route('/read-all').put(protect, admin, markAllAsRead);
router.route('/:id/read').put(protect, admin, markAsRead);

export default router;
