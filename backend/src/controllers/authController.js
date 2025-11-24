import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Account from '../models/Account.js';
import Candidate from '../models/Candidate.js';
import Employer from '../models/Employer.js';
import { sendMail } from '../utils/mailer.js';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Kiểm tra tài khoản tồn tại
    const account = await Account.findOne({ username });
    if (!account) {
      return res.status(401).json({
        status: 'error',
        message: 'Tài khoản không tồn tại'
      });
    }

    // Kiểm tra mật khẩu
    const isMatch = await account.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Mật khẩu không chính xác'
      });
    }

    // Kiểm tra trạng thái tài khoản
    if (account.status === 'locked') {
      return res.status(403).json({
        status: 'error',
        message: 'Tài khoản đã bị khóa'
      });
    }

    // Cập nhật thời gian đăng nhập
    account.lastLogin = new Date();
    await account.save();

    // Tạo JWT token
    const token = jwt.sign(
      { 
        id: account._id,
        type: account.type,
        candidateId: account.candidateId,
        employerId: account.employerId
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      status: 'success',
      data: {
        token,
        username: account.username,
        type: account.type,
        candidateId: account.candidateId,
        employerId: account.employerId
      }
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

export const register = async (req, res) => {
  try {
    const { username, password, type, ...profileData } = req.body;

    console.log('Register request:', { username, type, profileData });

    // Validation cơ bản
    if (!username || !password || !type) {
      return res.status(400).json({
        status: 'error',
        message: 'Username, password và type là bắt buộc'
      });
    }

    // Password validation đã được xử lý bởi middleware passwordValidator
    // Không cần validate lại ở đây

    // Kiểm tra username đã tồn tại
    const existingAccount = await Account.findOne({ username });
    if (existingAccount) {
      return res.status(400).json({
        status: 'error',
        message: 'Tên đăng nhập đã tồn tại'
      });
    }

    // Kiểm tra email đã tồn tại (cho candidate)
    if (type === 'candidate' && profileData.email) {
      const existingCandidate = await Candidate.findOne({ email: profileData.email });
      if (existingCandidate) {
        return res.status(400).json({
          status: 'error',
          message: 'Email đã được sử dụng'
        });
      }
    }

    // Kiểm tra email đã tồn tại (cho employer)
    if (type === 'employer' && profileData.email) {
      const existingEmployer = await Employer.findOne({ email: profileData.email });
      if (existingEmployer) {
        return res.status(400).json({
          status: 'error',
          message: 'Email đã được sử dụng'
        });
      }
    }

    // Tạo profile dựa vào loại tài khoản
    let profileId;
    if (type === 'candidate') {
      // Validate required fields cho candidate
      if (!profileData.fullName || !profileData.email) {
        return res.status(400).json({
          status: 'error',
          message: 'Họ tên và email là bắt buộc cho ứng viên'
        });
      }

      const candidate = new Candidate({
        fullName: profileData.fullName,
        email: profileData.email,
        phone: profileData.phone || '',
        gender: profileData.gender || '',
        birthDate: profileData.birthDate || null,
        education: profileData.education || '',
        experience: profileData.experience || '',
        summary: profileData.summary || ''
      });
      await candidate.save();
      profileId = { candidateId: candidate._id };
      
    } else if (type === 'employer') {
      // Validate required fields cho employer
      if (!profileData.companyName || !profileData.email) {
        return res.status(400).json({
          status: 'error',
          message: 'Tên công ty và email là bắt buộc cho nhà tuyển dụng'
        });
      }

      const employer = new Employer({
        companyName: profileData.companyName,
        email: profileData.email,
        phone: profileData.phone || '',
        field: profileData.field || '',
        address: profileData.address || '',
        description: profileData.description || '',
        website: profileData.website || ''
      });
      await employer.save();
      profileId = { employerId: employer._id };
    } else {
      return res.status(400).json({
        status: 'error',
        message: 'Loại tài khoản không hợp lệ'
      });
    }

    // Tạo tài khoản mới
    const account = new Account({
      username,
      password,
      type,
      status: 'active',
      ...profileId
    });

    await account.save();

    console.log('Account created successfully:', account._id);
    console.log('Password strength:', req.passwordStrengthLevel || 'N/A');

    // Sync to Neo4j (xử lý lỗi riêng để không ảnh hưởng đến registration)
    try {
      const neo4jService = (await import('../services/neo4jService.js')).default;
      
      // Sync account và profile
      if (type === 'candidate') {
        const candidate = await Candidate.findById(profileId.candidateId);
        await neo4jService.createOrUpdateCandidate(candidate.toObject());
        console.log('✅ [Neo4j] Synced new candidate:', candidate._id);
      } else if (type === 'employer') {
        const employer = await Employer.findById(profileId.employerId);
        await neo4jService.createOrUpdateEmployer(employer.toObject());
        console.log('✅ [Neo4j] Synced new employer:', employer._id);
      }
    } catch (neo4jError) {
      console.error('⚠️ [Neo4j] Failed to sync new account:', neo4jError.message);
      // Không throw error để không ảnh hưởng đến việc tạo account
    }

    // Gửi email thông báo (xử lý lỗi riêng)
    try {
      const emailContent = `
        Chào mừng bạn đến với hệ thống tuyển dụng TopJob!
        Tài khoản của bạn đã được tạo thành công.
        Username: ${username}
      `;

      await sendMail(
        profileData.email,
        'Đăng ký tài khoản thành công',
        emailContent
      );
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError.message);
      // Không throw error để không ảnh hưởng đến việc tạo account
    }

    res.status(201).json({
      status: 'success',
      message: 'Tạo tài khoản thành công'
    });

  } catch (error) {
    console.error('Register error:', error);
    
    // Xử lý các loại lỗi MongoDB cụ thể
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        status: 'error',
        message: `${field === 'email' ? 'Email' : 'Username'} đã tồn tại`
      });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      status: 'error',
      message: error.message || 'Có lỗi xảy ra khi đăng ký'
    });
  }
};

export const validateToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Token không tồn tại'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const account = await Account.findById(decoded.id);

    if (!account || account.status === 'locked') {
      return res.status(401).json({
        status: 'error',
        message: 'Token không hợp lệ hoặc tài khoản đã bị khóa'
      });
    }

    res.json({
      status: 'success',
      data: {
        id: account._id,
        type: account.type,
        candidateId: account.candidateId,
        employerId: account.employerId
      }
    });

  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: 'Token không hợp lệ'
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: 'Email là bắt buộc'
      });
    }

    // Tìm account qua email trong Candidate hoặc Employer
    let account = null;
    const candidate = await Candidate.findOne({ email });
    if (candidate) {
      account = await Account.findOne({ candidateId: candidate._id });
    } else {
      const employer = await Employer.findOne({ email });
      if (employer) {
        account = await Account.findOne({ employerId: employer._id });
      }
    }

    // Luôn trả về success để tránh leak thông tin
    if (!account) {
      return res.json({
        status: 'success',
        message: 'Nếu email tồn tại, link reset mật khẩu đã được gửi'
      });
    }

    // Tạo reset token
    const resetToken = jwt.sign(
      { id: account._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Lưu token vào database
    account.resetPasswordToken = resetToken;
    account.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await account.save();

    // Gửi email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const emailContent = `
      <h2>Yêu cầu đặt lại mật khẩu</h2>
      <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản TopJob của mình.</p>
      <p>Vui lòng click vào link dưới đây để đặt lại mật khẩu:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #9333ea; color: white; text-decoration: none; border-radius: 5px;">Đặt lại mật khẩu</a>
      <p>Link này sẽ hết hạn sau 1 giờ.</p>
      <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
    `;

    await sendMail(email, 'Đặt lại mật khẩu - TopJob', emailContent);

    res.json({
      status: 'success',
      message: 'Nếu email tồn tại, link reset mật khẩu đã được gửi'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Có lỗi xảy ra khi xử lý yêu cầu'
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Token và mật khẩu mới là bắt buộc'
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Token không hợp lệ hoặc đã hết hạn'
      });
    }

    // Tìm account
    const account = await Account.findById(decoded.id);
    if (!account) {
      return res.status(404).json({
        status: 'error',
        message: 'Tài khoản không tồn tại'
      });
    }

    // Kiểm tra token có khớp và chưa hết hạn
    if (account.resetPasswordToken !== token || account.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        status: 'error',
        message: 'Token không hợp lệ hoặc đã hết hạn'
      });
    }

    // Cập nhật mật khẩu mới
    account.password = newPassword;
    account.resetPasswordToken = undefined;
    account.resetPasswordExpires = undefined;
    await account.save();

    // Gửi email thông báo
    try {
      let email = '';
      if (account.candidateId) {
        const candidate = await Candidate.findById(account.candidateId);
        email = candidate?.email;
      } else if (account.employerId) {
        const employer = await Employer.findById(account.employerId);
        email = employer?.email;
      }

      if (email) {
        const emailContent = `
          <h2>Mật khẩu đã được đặt lại</h2>
          <p>Mật khẩu cho tài khoản TopJob của bạn đã được đặt lại thành công.</p>
          <p>Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ với chúng tôi ngay lập tức.</p>
        `;
        await sendMail(email, 'Mật khẩu đã được đặt lại - TopJob', emailContent);
      }
    } catch (emailError) {
      console.error('Failed to send password reset confirmation email:', emailError);
    }

    res.json({
      status: 'success',
      message: 'Đặt lại mật khẩu thành công'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Có lỗi xảy ra khi đặt lại mật khẩu'
    });
  }
};