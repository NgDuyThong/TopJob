import express from "express";
import {
  getAccounts,
  getAccount,
  updateAccountStatus,
  changePassword
} from "../controllers/accountController.js";
import { validateObjectId } from '../middlewares/validateObjectId.js';

const router = express.Router();

// Lấy danh sách tài khoản (admin)
router.get("/", getAccounts);

// Lấy thông tin một tài khoản
router.get("/:id", validateObjectId('id'), getAccount);

// Cập nhật trạng thái tài khoản (admin)
router.put("/:id/status", validateObjectId('id'), updateAccountStatus);

// Đổi mật khẩu (user tự đổi)
router.put("/change-password", changePassword);

export default router;
