import express from 'express';
import { getSettings, updateSetting } from '../controllers/settingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getSettings); // Make it public or protect it depending on needs, protect for now? Actually some settings (like theme) need to be public. For now let's just make getSettings public so frontend can fetch them without login.

router.route('/:key')
  .put(protect, admin, updateSetting);

export default router;
