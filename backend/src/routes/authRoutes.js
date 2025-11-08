import express from 'express';
import { login, register, validateToken } from '../controllers/authController.js';

const router = express.Router();

// Đăng nhập
router.post('/login', login);

// Đăng ký tài khoản
router.post('/register', register);

// Xác thực token
router.post('/validate-token', validateToken);

export default router;