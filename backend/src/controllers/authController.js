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

    if (password.length < 6) {
      return res.status(400).json({
        status: 'error',
        message: 'Mật khẩu phải có ít nhất 6 ký tự'
      });
    }

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