/**
 * Password Validation Middleware
 * Ràng buộc mật khẩu mạnh cho hệ thống
 */

export const validatePassword = (req, res, next) => {
  // Hỗ trợ cả 'password' và 'newPassword' field
  const password = req.body.password || req.body.newPassword;

  if (!password) {
    return res.status(400).json({
      status: 'error',
      message: 'Mật khẩu là bắt buộc'
    });
  }

  // Normalize để các validation sau dùng chung
  const passwordToValidate = password;

  // Danh sách các ràng buộc
  const errors = [];

  // 1. Độ dài tối thiểu 8 ký tự
  if (passwordToValidate.length < 8) {
    errors.push('Mật khẩu phải có ít nhất 8 ký tự');
  }

  // 2. Độ dài tối đa 50 ký tự
  if (passwordToValidate.length > 50) {
    errors.push('Mật khẩu không được vượt quá 50 ký tự');
  }

  // 3. Phải có ít nhất 1 chữ hoa
  if (!/[A-Z]/.test(passwordToValidate)) {
    errors.push('Mật khẩu phải có ít nhất 1 chữ cái viết hoa');
  }

  // 4. Phải có ít nhất 1 chữ thường
  if (!/[a-z]/.test(passwordToValidate)) {
    errors.push('Mật khẩu phải có ít nhất 1 chữ cái viết thường');
  }

  // 5. Phải có ít nhất 1 chữ số
  if (!/[0-9]/.test(passwordToValidate)) {
    errors.push('Mật khẩu phải có ít nhất 1 chữ số');
  }

  // 6. Phải có ít nhất 1 ký tự đặc biệt
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordToValidate)) {
    errors.push('Mật khẩu phải có ít nhất 1 ký tự đặc biệt (!@#$%^&*...)');
  }

  // 7. Không được chứa khoảng trắng
  if (/\s/.test(passwordToValidate)) {
    errors.push('Mật khẩu không được chứa khoảng trắng');
  }

  // 8. Không được chứa username (nếu có)
  if (req.body.username && passwordToValidate.toLowerCase().includes(req.body.username.toLowerCase())) {
    errors.push('Mật khẩu không được chứa tên đăng nhập');
  }

  // 9. Không được chứa email (nếu có)
  if (req.body.email) {
    const emailPrefix = req.body.email.split('@')[0];
    if (passwordToValidate.toLowerCase().includes(emailPrefix.toLowerCase())) {
      errors.push('Mật khẩu không được chứa địa chỉ email');
    }
  }

  // 10. Kiểm tra các mật khẩu phổ biến/yếu
  const commonPasswords = [
    'password', 'Password123', '12345678', 'qwerty123', 'abc123456',
    'password1', 'Password1', '123456789', 'Qwerty123', 'Admin123',
    'Welcome123', 'Passw0rd', 'P@ssw0rd', 'P@ssword1', 'Password@123'
  ];

  if (commonPasswords.some(common => passwordToValidate.toLowerCase().includes(common.toLowerCase()))) {
    errors.push('Mật khẩu quá phổ biến, vui lòng chọn mật khẩu khác');
  }

  // 11. Kiểm tra chuỗi lặp lại (ví dụ: "aaa", "111")
  if (/(.)\1{2,}/.test(passwordToValidate)) {
    errors.push('Mật khẩu không được chứa ký tự lặp lại liên tiếp (ví dụ: aaa, 111)');
  }

  // 12. Kiểm tra chuỗi tuần tự (ví dụ: "abc", "123")
  const hasSequential = (str) => {
    const sequences = ['0123456789', 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
    for (let seq of sequences) {
      for (let i = 0; i < seq.length - 2; i++) {
        if (str.includes(seq.substring(i, i + 3))) {
          return true;
        }
      }
    }
    return false;
  };

  if (hasSequential(passwordToValidate)) {
    errors.push('Mật khẩu không được chứa chuỗi ký tự tuần tự (ví dụ: abc, 123)');
  }

  // Nếu có lỗi, trả về danh sách lỗi
  if (errors.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Mật khẩu không đáp ứng yêu cầu bảo mật',
      errors: errors
    });
  }

  // Tính điểm mạnh của mật khẩu (0-100)
  let strength = 0;
  
  // Độ dài
  if (passwordToValidate.length >= 8) strength += 20;
  if (passwordToValidate.length >= 12) strength += 10;
  if (passwordToValidate.length >= 16) strength += 10;
  
  // Đa dạng ký tự
  if (/[a-z]/.test(passwordToValidate)) strength += 10;
  if (/[A-Z]/.test(passwordToValidate)) strength += 10;
  if (/[0-9]/.test(passwordToValidate)) strength += 10;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordToValidate)) strength += 15;
  
  // Số lượng ký tự đặc biệt
  const specialChars = passwordToValidate.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g);
  if (specialChars && specialChars.length >= 2) strength += 10;
  
  // Kết hợp chữ hoa, chữ thường, số, ký tự đặc biệt
  const hasLower = /[a-z]/.test(passwordToValidate);
  const hasUpper = /[A-Z]/.test(passwordToValidate);
  const hasNumber = /[0-9]/.test(passwordToValidate);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordToValidate);
  
  if (hasLower && hasUpper && hasNumber && hasSpecial) strength += 5;

  // Lưu thông tin vào request để sử dụng sau
  req.passwordStrength = strength;
  req.passwordStrengthLevel = 
    strength >= 80 ? 'Rất mạnh' :
    strength >= 60 ? 'Mạnh' :
    strength >= 40 ? 'Trung bình' :
    'Yếu';

  next();
};

/**
 * Validate password confirmation
 */
export const validatePasswordConfirmation = (req, res, next) => {
  const { password, confirmPassword } = req.body;

  if (!confirmPassword) {
    return res.status(400).json({
      status: 'error',
      message: 'Vui lòng xác nhận mật khẩu'
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      status: 'error',
      message: 'Mật khẩu xác nhận không khớp'
    });
  }

  next();
};

/**
 * Generate password strength message
 */
export const getPasswordStrengthMessage = (strength) => {
  if (strength >= 80) {
    return {
      level: 'Rất mạnh',
      color: 'green',
      message: 'Mật khẩu rất an toàn'
    };
  } else if (strength >= 60) {
    return {
      level: 'Mạnh',
      color: 'blue',
      message: 'Mật khẩu đủ mạnh'
    };
  } else if (strength >= 40) {
    return {
      level: 'Trung bình',
      color: 'orange',
      message: 'Mật khẩu có thể cải thiện'
    };
  } else {
    return {
      level: 'Yếu',
      color: 'red',
      message: 'Mật khẩu quá yếu, cần cải thiện'
    };
  }
};
