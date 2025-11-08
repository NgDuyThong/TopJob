import Account from "../models/Account.js";

export const getAccounts = async (req, res) => {
  try {
    // Chỉ admin mới có quyền xem danh sách tài khoản
    if (req.user.type !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Không có quyền truy cập'
      });
    }

    const accounts = await Account.find()
      .select('-password')
      .populate('candidateId', 'fullName email')
      .populate('employerId', 'companyName email');

    res.json({
      status: 'success',
      data: accounts
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

export const getAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id)
      .select('-password')
      .populate('candidateId', 'fullName email')
      .populate('employerId', 'companyName email');

    if (!account) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy tài khoản'
      });
    }

    // Kiểm tra quyền truy cập
    if (req.user.type !== 'admin' && req.user.id !== account._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Không có quyền truy cập'
      });
    }

    res.json({
      status: 'success',
      data: account
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

export const updateAccountStatus = async (req, res) => {
  try {
    // Chỉ admin mới có quyền cập nhật trạng thái tài khoản
    if (req.user.type !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Không có quyền truy cập'
      });
    }

    const { status } = req.body;
    const account = await Account.findById(req.params.id);

    if (!account) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy tài khoản'
      });
    }

    account.status = status;
    await account.save();

    res.json({
      status: 'success',
      message: 'Cập nhật trạng thái tài khoản thành công'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const account = await Account.findById(req.user.id);

    // Kiểm tra mật khẩu cũ
    const isMatch = await account.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({
        status: 'error',
        message: 'Mật khẩu cũ không chính xác'
      });
    }

    // Cập nhật mật khẩu mới
    account.password = newPassword;
    await account.save();

    res.json({
      status: 'success',
      message: 'Đổi mật khẩu thành công'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
