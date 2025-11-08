import Application from '../models/Application.js';
import JobPost from '../models/JobPost.js';
import Candidate from '../models/Candidate.js';
import Employer from '../models/Employer.js';
import { sendMail } from '../utils/mailer.js';

export const getAllApplications = async (req, res) => {
  try {
    // Chỉ admin mới có quyền xem tất cả đơn ứng tuyển
    if (req.user.type !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Không có quyền truy cập'
      });
    }

    const { page = 1, limit = 10 } = req.query;
    
    const applications = await Application.find()
      .populate('candidateId', 'fullName email')
      .populate('jobpostId', 'title')
      .sort({ submitDate: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Application.countDocuments();

    res.json({
      status: 'success',
      data: {
        applications,
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

export const submitApplication = async (req, res) => {
  try {
    const { jobpostId, coverLetter } = req.body;
    const candidateId = req.user.candidateId;

    // Kiểm tra có file CV được upload không
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'Vui lòng upload file CV'
      });
    }

    // Kiểm tra job có tồn tại và còn hạn nộp
    const job = await JobPost.findOne({
      _id: jobpostId,
      status: { $in: ['open', 'active'] },
      deadline: { $gt: new Date() }
    }).populate('employerId', 'companyName email');

    if (!job) {
      return res.status(400).json({
        status: 'error',
        message: 'Bài đăng không tồn tại hoặc đã hết hạn'
      });
    }

    // Kiểm tra ứng viên đã nộp đơn cho job này chưa
    const existingApplication = await Application.findOne({
      candidateId,
      jobpostId
    });

    if (existingApplication) {
      return res.status(400).json({
        status: 'error',
        message: 'Bạn đã nộp đơn cho vị trí này'
      });
    }

    // Lấy thông tin ứng viên
    const candidate = await Candidate.findById(candidateId);

    if (!candidate) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy thông tin ứng viên'
      });
    }

    // Tạo đơn ứng tuyển mới
    const application = new Application({
      candidateId,
      jobpostId,
      resumeFile: req.file.filename,
      coverLetter,
      jobSummary: {
        title: job.title,
        employerName: job.employerId.companyName
      },
      candidateSummary: {
        fullName: candidate.fullName,
        email: candidate.email
      }
    });

    await application.save();

    // Cập nhật số lượng đơn ứng tuyển trong job
    await JobPost.findByIdAndUpdate(jobpostId, {
      $inc: { applicationsCount: 1 }
    });

    // Cập nhật danh sách đơn ứng tuyển của ứng viên
    await Candidate.findByIdAndUpdate(candidateId, {
      $push: { applications: application._id }
    });

    // Sync to Neo4j (tạo APPLIED_TO relationship)
    try {
      const neo4jService = (await import('../services/neo4jService.js')).default;
      await neo4jService.createApplication(
        application.toObject(),
        candidateId.toString(),
        jobpostId.toString()
      );
      console.log('✅ [Neo4j] Synced new application:', application._id);
    } catch (neo4jError) {
      console.error('⚠️ [Neo4j] Failed to sync application:', neo4jError.message);
    }

    // Gửi email thông báo cho nhà tuyển dụng (xử lý lỗi email riêng)
    try {
      await sendMail(
        job.employerId.email,
        `Có đơn ứng tuyển mới cho vị trí ${job.title}`,
        `
          Ứng viên ${candidate.fullName} vừa nộp đơn ứng tuyển cho vị trí ${job.title}.
          Email ứng viên: ${candidate.email}
          Thời gian nộp: ${new Date().toLocaleString()}
        `
      );
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError.message);
      // Không throw error để không ảnh hưởng đến việc tạo application
    }

    res.status(201).json({
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

export const getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('jobpostId')
      .populate('candidateId');

    if (!application) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy đơn ứng tuyển'
      });
    }

    // Kiểm tra quyền truy cập
    const isCandidate = req.user.candidateId === application.candidateId._id.toString();
    const isEmployer = req.user.employerId === application.jobpostId.employerId.toString();

    if (!isCandidate && !isEmployer && req.user.type !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Không có quyền truy cập'
      });
    }

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

export const withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      candidateId: req.user.candidateId
    });

    if (!application) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy đơn ứng tuyển'
      });
    }

    // Chỉ cho phép rút đơn khi chưa được xem xét
    if (application.status.name !== 'Submitted') {
      return res.status(400).json({
        status: 'error',
        message: 'Không thể rút đơn ở trạng thái này'
      });
    }

    // Cập nhật số lượng đơn trong job
    await JobPost.findByIdAndUpdate(application.jobpostId, {
      $inc: { applicationsCount: -1 }
    });

    // Xóa khỏi danh sách đơn của ứng viên
    await Candidate.findByIdAndUpdate(req.user.candidateId, {
      $pull: { applications: application._id }
    });

    // Xóa đơn ứng tuyển
    await application.deleteOne();

    res.json({
      status: 'success',
      message: 'Rút đơn ứng tuyển thành công'
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
    const { id } = req.params;
    const { status } = req.body;

    const application = await Application.findById(id)
      .populate('jobpostId')
      .populate('candidateId');

    if (!application) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy đơn ứng tuyển'
      });
    }

    // Kiểm tra quyền cập nhật
    const isEmployer = req.user.employerId === application.jobpostId.employerId.toString();
    if (!isEmployer && req.user.type !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Không có quyền cập nhật'
      });
    }

    // Cập nhật trạng thái
    application.status = {
      name: status,
      updatedAt: new Date()
    };

    await application.save();

    // Gửi email thông báo cho ứng viên (xử lý lỗi riêng)
    try {
      await sendMail(
        application.candidateId.email,
        `Cập nhật trạng thái đơn ứng tuyển - ${application.jobSummary.title}`,
        `
          Đơn ứng tuyển của bạn cho vị trí ${application.jobSummary.title} 
          tại ${application.jobSummary.employerName} đã được cập nhật trạng thái.
          
          Trạng thái mới: ${status}
          Thời gian cập nhật: ${new Date().toLocaleString()}
        `
      );
    } catch (emailError) {
      console.error('Failed to send status update email:', emailError.message);
      // Không throw error
    }

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

export const getApplicationsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // Kiểm tra quyền truy cập
    const job = await JobPost.findOne({
      _id: jobId,
      employerId: req.user.employerId
    });

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy bài đăng tuyển dụng'
      });
    }

    const applications = await Application.find({ jobpostId: jobId })
      .populate('candidateId')
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

export const getApplicationsByCandidate = async (req, res) => {
  try {
    const { candidateId } = req.params;

    // Kiểm tra quyền truy cập
    if (req.user.candidateId !== candidateId && req.user.type !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Không có quyền truy cập'
      });
    }

    const applications = await Application.find({ candidateId })
      .populate('jobpostId')
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