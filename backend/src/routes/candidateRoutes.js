import express from 'express';
import {
  getAllCandidates,
  getCandidateProfile,
  updateCandidateProfile,
  getCandidateApplications,
  updateCandidateSkills,
  searchJobsBySkills,
  getSavedJobs,
  saveJob,
  unsaveJob
} from '../controllers/candidateController.js';

const router = express.Router();

// Lấy danh sách tất cả ứng viên (admin)
router.get('/', getAllCandidates);

// Lấy thông tin profile ứng viên
router.get('/profile', getCandidateProfile);

// Cập nhật profile ứng viên
router.put('/profile', updateCandidateProfile);

// Lấy danh sách các đơn ứng tuyển
router.get('/applications', getCandidateApplications);

// Cập nhật kỹ năng
router.put('/skills', updateCandidateSkills);

// Tìm kiếm việc làm phù hợp với kỹ năng
router.get('/matching-jobs', searchJobsBySkills);

// Saved jobs routes
router.get('/saved-jobs', getSavedJobs);
router.post('/saved-jobs/:jobId', saveJob);
router.delete('/saved-jobs/:jobId', unsaveJob);

export default router;