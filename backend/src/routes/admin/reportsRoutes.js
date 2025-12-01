import express from 'express';
import { getReports, getReportsSummary, getDashboardStats } from '../../controllers/admin/reportsController.js';

const router = express.Router();

// Get dashboard statistics (overall stats)
router.get('/dashboard', getDashboardStats);

// Get reports data with date range filtering
router.get('/', getReports);

// Get reports summary statistics
router.get('/summary', getReportsSummary);

export default router;
