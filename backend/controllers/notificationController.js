import asyncHandler from 'express-async-handler';
import Notification from '../models/Notification.js';

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Private/Admin
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({}).sort({ createdAt: -1 }).limit(50);
  res.json(notifications);
});

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private/Admin
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (notification) {
    notification.isRead = true;
    const updatedNotification = await notification.save();
    res.json(updatedNotification);
  } else {
    res.status(404);
    throw new Error('Notification not found');
  }
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private/Admin
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ isRead: false }, { isRead: true });
  res.json({ message: 'All notifications marked as read' });
});

export { getNotifications, markAsRead, markAllAsRead };
