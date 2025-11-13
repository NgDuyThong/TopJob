import express from 'express';
import {
  getApplications,
  getApplicationDetail,
  updateApplicationStatus
} from '../../controllers/admin/applicationsController.js';
import { validateObjectId } from '../../middlewares/validateObjectId.js';

const router = express.Router();

// Get all applications with pagination and filters
router.get('/', getApplications);

// Get application detail by ID
router.get('/:id', validateObjectId('id'), getApplicationDetail);

// Update application status
router.put('/:id/status', validateObjectId('id'), updateApplicationStatus);

export default router;
