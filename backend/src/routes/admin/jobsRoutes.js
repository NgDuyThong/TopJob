import express from 'express';
import {
  getJobs,
  getJobDetail,
  updateJobStatus,
  deleteJob
} from '../../controllers/admin/jobsController.js';
import { validateObjectId } from '../../middlewares/validateObjectId.js';

const router = express.Router();

// Get all jobs with pagination and filters
router.get('/', getJobs);

// Get job detail by ID
router.get('/:id', validateObjectId('id'), getJobDetail);

// Update job status
router.put('/:id/status', validateObjectId('id'), updateJobStatus);

// Delete job
router.delete('/:id', validateObjectId('id'), deleteJob);

export default router;
