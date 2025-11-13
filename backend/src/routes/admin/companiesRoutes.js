import express from 'express';
import {
  getCompanies,
  getCompanyDetail,
  verifyCompany
} from '../../controllers/admin/companiesController.js';
import { validateObjectId } from '../../middlewares/validateObjectId.js';

const router = express.Router();

// Get all companies with pagination and search
router.get('/', getCompanies);

// Get company detail by ID
router.get('/:id', validateObjectId('id'), getCompanyDetail);

// Verify/Unverify company
router.put('/:id/verify', validateObjectId('id'), verifyCompany);

export default router;
