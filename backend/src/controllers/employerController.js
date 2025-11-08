import Employer from '../models/Employer.js';
import JobPost from '../models/JobPost.js';
import Application from '../models/Application.js';
import Candidate from '../models/Candidate.js';

export const getAllEmployers = async (req, res) => {
  try {
    // Chỉ admin mới có quyền xem danh sách nhà tuyển dụng
    if (req.user.type !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Không có quyền truy cập'
      });
    }

    const { page = 1, limit = 10 } = req.query;
    
    const employers = await Employer.find()
      .select('-jobPosts') // Exclude jobPosts array for performance
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Employer.countDocuments();

    res.json({
      status: 'success',
      data: {
        employers,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

export const getEmployerProfile = async (req, res) => {
  try {
    const employer = await Employer.findById(req.user.employerId)
      .populate('jobPosts.jobId');

    if (!employer) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy thông tin nhà tuyển dụng'
      });
    }

    res.json({
      status: 'success',
      data: employer
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

export const updateEmployerProfile = async (req, res) => {
  try {
    const employer = await Employer.findByIdAndUpdate(
      req.user.employerId,
      {
        $set: req.body
      },
      { new: true, runValidators: true }
    );

    res.json({
      status: 'success',
      data: employer
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

export const getPostedJobs = async (req, res) => {
  try {
    const jobs = await JobPost.find({ employerId: req.user.employerId })
      .sort({ datePosted: -1 });

    res.json({
      status: 'success',
      data: jobs
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

export const getJobApplications = async (req, res) => {
  try {
    // Kiểm tra quyền sở hữu job
    const job = await JobPost.findOne({
      _id: req.params.jobId,
      employerId: req.user.employerId
    });

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy bài đăng tuyển dụng'
      });
    }

    const applications = await Application.find({ jobpostId: req.params.jobId })
      .populate('candidateId', 'fullName email phone education experience skills')
      .sort({ submitDate: -1 });

    res.json({
      status: 'success',
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const application = await Application.findById(req.params.applicationId);

    if (!application) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy đơn ứng tuyển'
      });
    }

    // Kiểm tra quyền cập nhật
    const job = await JobPost.findOne({
      _id: application.jobpostId,
      employerId: req.user.employerId
    });

    if (!job) {
      return res.status(403).json({
        status: 'error',
        message: 'Không có quyền cập nhật đơn ứng tuyển này'
      });
    }

    // Cập nhật trạng thái
    application.status = {
      name: status,
      updatedAt: new Date()
    };

    // Thêm vào lịch sử xem
    if (!application.viewedHistory.some(
      vh => vh.employerId.toString() === req.user.employerId
    )) {
      application.viewedHistory.push({
        employerId: req.user.employerId,
        viewedAt: new Date()
      });
    }

    await application.save();

    res.json({
      status: 'success',
      data: application
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

export const getApplicationDetail = async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId)
      .populate('jobpostId', 'title position location salary')
      .populate('candidateId');

    if (!application) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy đơn ứng tuyển'
      });
    }

    // Kiểm tra quyền xem
    const job = await JobPost.findOne({
      _id: application.jobpostId,
      employerId: req.user.employerId
    });

    if (!job) {
      return res.status(403).json({
        status: 'error',
        message: 'Không có quyền xem đơn ứng tuyển này'
      });
    }

    // Thêm vào lịch sử xem
    if (!application.viewedHistory.some(
      vh => vh.employerId && vh.employerId.toString() === req.user.employerId
    )) {
      application.viewedHistory.push({
        employerId: req.user.employerId,
        viewedAt: new Date()
      });
      await application.save();
    }

    // Prepare candidate summary
    const candidate = application.candidateId;
    const candidateSummary = {
      fullName: candidate.fullName,
      email: candidate.email,
      phone: candidate.phone,
      address: candidate.address,
      skills: candidate.skills,
      experience: candidate.experience,
      education: candidate.education
    };

    res.json({
      status: 'success',
      data: {
        ...application.toObject(),
        candidateSummary
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

export const getMatchingCandidates = async (req, res) => {
  try {
    const job = await JobPost.findOne({
      _id: req.params.jobId,
      employerId: req.user.employerId
    });

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy bài đăng tuyển dụng'
      });
    }

    // Lấy danh sách kỹ năng yêu cầu
    const requiredSkills = job.skillsRequired.map(skill => skill.name.toLowerCase());

    // Tìm ứng viên có kỹ năng phù hợp
    const candidates = await Candidate.find({
      'skills.name': { 
        $in: requiredSkills.map(skill => new RegExp(skill, 'i'))
      }
    });

    // Tính toán độ phù hợp cho mỗi ứng viên
    const candidatesWithScore = candidates.map(candidate => {
      const matchingSkills = candidate.skills.filter(
        skill => requiredSkills.includes(skill.name.toLowerCase())
      );

      const matchScore = (matchingSkills.length / requiredSkills.length) * 100;

      return {
        _id: candidate._id,
        fullName: candidate.fullName,
        email: candidate.email,
        education: candidate.education,
        experience: candidate.experience,
        skills: candidate.skills,
        matchScore: Math.round(matchScore),
        matchingSkills: matchingSkills
      };
    });

    // Sắp xếp theo độ phù hợp
    candidatesWithScore.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      status: 'success',
      data: candidatesWithScore
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Public endpoints - Không cần authentication
export const getPublicEmployers = async (req, res) => {
  try {
    const { page = 1, limit = 12, field, q } = req.query;
    
    const filters = {};
    
    if (field) {
      filters.field = new RegExp(field, 'i');
    }
    
    if (q) {
      filters.$or = [
        { companyName: new RegExp(q, 'i') },
        { description: new RegExp(q, 'i') },
        { field: new RegExp(q, 'i') }
      ];
    }

    const employers = await Employer.find(filters)
      .select('companyName field email phone address description website jobPosts')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Employer.countDocuments(filters);

    res.json({
      status: 'success',
      data: {
        employers,
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page)
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

export const getPublicEmployerById = async (req, res) => {
  try {
    const employer = await Employer.findById(req.params.id)
      .select('companyName field email phone address description website jobPosts');

    if (!employer) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy thông tin công ty'
      });
    }

    res.json({
      status: 'success',
      data: employer
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Tìm kiếm ứng viên
export const searchCandidates = async (req, res) => {
  try {
    const { keyword, education, experience, skills, location } = req.query;
    
    const filters = {};
    
    // Tìm kiếm theo từ khóa (tên, email)
    if (keyword) {
      filters.$or = [
        { name: new RegExp(keyword, 'i') },
        { email: new RegExp(keyword, 'i') }
      ];
    }
    
    // Lọc theo trình độ học vấn
    if (education) {
      filters['education.degree'] = new RegExp(education, 'i');
    }
    
    // Lọc theo kinh nghiệm (số năm)
    if (experience) {
      const years = parseInt(experience);
      if (!isNaN(years)) {
        filters['experience.0'] = { $exists: true }; // Có ít nhất 1 kinh nghiệm
      }
    }
    
    // Lọc theo kỹ năng - skills là array of objects {name, level}
    if (skills) {
      const skillArray = skills.split(',').map(s => s.trim());
      filters['skills.name'] = { 
        $in: skillArray.map(skill => new RegExp(skill, 'i'))
      };
    }
    
    // Lọc theo địa điểm
    if (location) {
      filters.address = new RegExp(location, 'i');
    }
    
    const candidates = await Candidate.find(filters)
      .select('name email phone address education experience skills')
      .limit(50);
    
    res.json({
      status: 'success',
      data: candidates
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Lấy chi tiết ứng viên
export const getCandidateDetail = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.candidateId)
      .select('-applications'); // Exclude applications for privacy
    
    if (!candidate) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy ứng viên'
      });
    }
    
    res.json({
      status: 'success',
      data: candidate
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Lưu ứng viên
export const saveCandidate = async (req, res) => {
  try {
    const employer = await Employer.findById(req.user.employerId);
    
    if (!employer) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy nhà tuyển dụng'
      });
    }
    
    // Khởi tạo savedCandidates nếu chưa có
    if (!employer.savedCandidates) {
      employer.savedCandidates = [];
    }
    
    const candidateId = req.params.candidateId;
    
    // Kiểm tra ứng viên có tồn tại không
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy ứng viên'
      });
    }
    
    // Kiểm tra đã lưu chưa
    if (employer.savedCandidates.includes(candidateId)) {
      return res.status(400).json({
        status: 'error',
        message: 'Ứng viên đã được lưu trước đó'
      });
    }
    
    employer.savedCandidates.push(candidateId);
    await employer.save();
    
    res.json({
      status: 'success',
      message: 'Đã lưu ứng viên'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Bỏ lưu ứng viên
export const unsaveCandidate = async (req, res) => {
  try {
    const employer = await Employer.findById(req.user.employerId);
    
    if (!employer) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy nhà tuyển dụng'
      });
    }
    
    const candidateId = req.params.candidateId;
    
    if (!employer.savedCandidates || !employer.savedCandidates.includes(candidateId)) {
      return res.status(400).json({
        status: 'error',
        message: 'Ứng viên chưa được lưu'
      });
    }
    
    employer.savedCandidates = employer.savedCandidates.filter(
      id => id.toString() !== candidateId
    );
    await employer.save();
    
    res.json({
      status: 'success',
      message: 'Đã bỏ lưu ứng viên'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Lấy danh sách ứng viên đã lưu
export const getSavedCandidates = async (req, res) => {
  try {
    const employer = await Employer.findById(req.user.employerId)
      .populate({
        path: 'savedCandidates',
        select: 'name email phone address education experience skills'
      });
    
    if (!employer) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy nhà tuyển dụng'
      });
    }
    
    res.json({
      status: 'success',
      data: employer.savedCandidates || []
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};