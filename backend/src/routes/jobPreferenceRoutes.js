import express from 'express';
import { verifyToken } from '../middlewares/auth.js';
import {
  getJobPreferences,
  updateJobPreferences,
  resetJobPreferences
} from '../controllers/jobPreferenceController.js';

const router = express.Router();

// Tất cả routes đều cần authentication
router.use(verifyToken);

// GET /api/job-preferences - Lấy preferences
router.get('/', getJobPreferences);

// PUT /api/job-preferences - Cập nhật preferences
router.put('/', updateJobPreferences);

// POST /api/job-preferences/reset - Reset về mặc định
router.post('/reset', resetJobPreferences);

export default router;
