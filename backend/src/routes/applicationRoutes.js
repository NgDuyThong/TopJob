import express from 'express';
import multer from 'multer';
import {
  getAllApplications,
  submitApplication,
  getApplication,
  withdrawApplication,
  updateApplicationStatus,
  getApplicationsByJob,
  getApplicationsByCandidate
} from '../controllers/applicationController.js';
import { validateObjectId } from '../middlewares/validateObjectId.js';

// Cấu hình multer để upload file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/resumes')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/msword' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Only .pdf, .doc & .docx format allowed!'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const router = express.Router();

// Lấy danh sách tất cả đơn ứng tuyển (admin)
router.get('/', getAllApplications);

// Nộp đơn ứng tuyển mới
router.post('/', upload.single('resume'), submitApplication);

// Lấy danh sách đơn ứng tuyển theo job (specific route - put before generic /:id)
router.get('/job/:jobId', validateObjectId('jobId'), getApplicationsByJob);

// Lấy danh sách đơn ứng tuyển của ứng viên (specific route - put before generic /:id)
router.get('/candidate/:candidateId', validateObjectId('candidateId'), getApplicationsByCandidate);

// Cập nhật trạng thái đơn ứng tuyển (dành cho nhà tuyển dụng)
router.put('/:id/status', validateObjectId('id'), updateApplicationStatus);

// Lấy thông tin một đơn ứng tuyển
router.get('/:id', validateObjectId('id'), getApplication);

// Rút lại đơn ứng tuyển
router.delete('/:id', validateObjectId('id'), withdrawApplication);

export default router;