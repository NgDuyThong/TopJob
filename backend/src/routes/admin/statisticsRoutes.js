import express from 'express';
import {
  getStatistics,
  getRecentJobs,
  getRecentApplications
} from '../../controllers/admin/statisticsController.js';

const router = express.Router();

// Get dashboard statistics
router.get('/', getStatistics);

// Get recent jobs for dashboard
router.get('/recent-jobs', getRecentJobs);

// Get recent applications for dashboard
router.get('/recent-applications', getRecentApplications);

export default router;
