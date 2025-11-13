import express from 'express';
import {
  getUsers,
  getUserDetail,
  updateUserStatus
} from '../../controllers/admin/usersController.js';
import { validateObjectId } from '../../middlewares/validateObjectId.js';

const router = express.Router();

// Get all users with pagination and filters
router.get('/', getUsers);

// Get user detail by ID
router.get('/:id', validateObjectId('id'), getUserDetail);

// Update user status
router.put('/:id/status', validateObjectId('id'), updateUserStatus);

export default router;
