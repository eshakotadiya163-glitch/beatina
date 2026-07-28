import express from 'express';
import { submitContactMessage, getContactMessages } from '../controllers/contactController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(submitContactMessage)
  .get(protect, admin, getContactMessages);

export default router;
