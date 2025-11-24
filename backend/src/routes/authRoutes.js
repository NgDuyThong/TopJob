import express from 'express';
import { login, register, validateToken, forgotPassword, resetPassword } from '../controllers/authController.js';
import { validatePassword, validatePasswordConfirmation } from '../middlewares/passwordValidator.js';

const router = express.Router();

// Đăng nhập
router.post('/login', login);

// Đăng ký tài khoản (với validation mật khẩu mạnh)
router.post('/register', validatePassword, validatePasswordConfirmation, register);

// Xác thực token
router.post('/validate-token', validateToken);

// Quên mật khẩu
router.post('/forgot-password', forgotPassword);

// Đặt lại mật khẩu
router.post('/reset-password', validatePassword, resetPassword);

export default router;