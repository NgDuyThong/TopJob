import express from 'express';
import { verifyAdmin } from '../middlewares/adminAuth.js';
import statisticsRoutes from './admin/statisticsRoutes.js';
import usersRoutes from './admin/usersRoutes.js';
import jobsRoutes from './admin/jobsRoutes.js';
import companiesRoutes from './admin/companiesRoutes.js';
import applicationsRoutes from './admin/applicationsRoutes.js';
import reportsRoutes from './admin/reportsRoutes.js';

const router = express.Router();

// Apply admin authentication middleware to all routes
router.use(verifyAdmin);

// Admin routes
router.use('/statistics', statisticsRoutes);
router.use('/users', usersRoutes);
router.use('/jobs', jobsRoutes);
router.use('/companies', companiesRoutes);
router.use('/applications', applicationsRoutes);
router.use('/reports', reportsRoutes);

// Health check for admin routes
router.get('/health', (req, res) => {
  res.json({ 
    status: 'success',
    message: 'Admin routes are working',
    user: req.user
  });
});

export default router;
