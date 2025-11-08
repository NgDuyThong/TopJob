import express from 'express';
import {
  createJobPost,
  updateJobPost,
  deleteJobPost,
  getJobPost,
  getAllJobPosts,
  searchJobPosts,
  getRecentJobPosts,
  incrementJobViews
} from '../controllers/jobPostController.js';
import { verifyToken } from '../middlewares/auth.js';
import { validateObjectId } from '../middlewares/validateObjectId.js';

const router = express.Router();

// Public routes
router.get('/', getAllJobPosts);
router.get('/search', searchJobPosts);
router.get('/recent', getRecentJobPosts);
// NOTE: place specific '/:id/view' before generic '/:id' to avoid route collision
router.post('/:id/view', validateObjectId('id'), incrementJobViews);
router.get('/:id', validateObjectId('id'), getJobPost);

// Protected routes (require authentication)
router.use(verifyToken);
router.post('/', createJobPost);
router.put('/:id', updateJobPost);
router.delete('/:id', deleteJobPost);

export default router;