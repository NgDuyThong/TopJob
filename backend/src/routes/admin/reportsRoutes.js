import express from 'express';
import {
  getReports,
  getReportsSummary
} from '../../controllers/admin/reportsController.js';

const router = express.Router();

// Get reports data with date range filtering
router.get('/', getReports);

// Get reports summary statistics
router.get('/summary', getReportsSummary);

export default router;
