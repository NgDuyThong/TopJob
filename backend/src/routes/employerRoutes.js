import express from 'express';
import { verifyToken } from '../middlewares/auth.js';
import {
  getAllEmployers,
  getEmployerProfile,
  updateEmployerProfile,
  getPostedJobs,
  getJobApplications,
  updateApplicationStatus,
  getApplicationDetail,
  getMatchingCandidates,
  getPublicEmployers,
  getPublicEmployerById,
  searchCandidates,
  getCandidateDetail,
  saveCandidate,
  unsaveCandidate,
  getSavedCandidates
} from '../controllers/employerController.js';

const router = express.Router();

// Public routes (không cần authentication)
router.get('/public', getPublicEmployers);
router.get('/public/:id', getPublicEmployerById);

// Protected routes (cần authentication)
router.use(verifyToken);

// Lấy danh sách tất cả nhà tuyển dụng (admin)
router.get('/', getAllEmployers);

// Lấy thông tin profile nhà tuyển dụng
router.get('/profile', getEmployerProfile);

// Cập nhật profile nhà tuyển dụng
router.put('/profile', updateEmployerProfile);

// Lấy danh sách bài đăng tuyển dụng
router.get('/jobs', getPostedJobs);

// Lấy danh sách ứng viên cho một bài đăng
router.get('/jobs/:jobId/applications', getJobApplications);

// Lấy chi tiết đơn ứng tuyển
router.get('/applications/:applicationId', getApplicationDetail);

// Cập nhật trạng thái đơn ứng tuyển
router.put('/applications/:applicationId/status', updateApplicationStatus);

// Tìm ứng viên phù hợp với yêu cầu công việc
router.get('/jobs/:jobId/matching-candidates', getMatchingCandidates);

// Tìm kiếm ứng viên theo tiêu chí
router.get('/candidates/search', searchCandidates);

// Lấy chi tiết ứng viên
router.get('/candidates/:candidateId', getCandidateDetail);

// Lưu ứng viên
router.post('/candidates/:candidateId/save', saveCandidate);

// Bỏ lưu ứng viên
router.delete('/candidates/:candidateId/save', unsaveCandidate);

// Lấy danh sách ứng viên đã lưu
router.get('/saved-candidates', getSavedCandidates);

export default router;