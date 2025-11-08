import Candidate from '../models/Candidate.js';
import JobPost from '../models/JobPost.js';
import Application from '../models/Application.js';

export const getAllCandidates = async (req, res) => {
  try {
    // Chỉ admin mới có quyền xem danh sách ứng viên
    if (req.user.type !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Không có quyền truy cập'
      });
    }

    const { page = 1, limit = 10 } = req.query;
    
    const candidates = await Candidate.find()
      .select('-applications') // Exclude applications array for performance
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Candidate.countDocuments();

    res.json({
      status: 'success',
      data: {
        candidates,
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

export const getCandidateProfile = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.user.candidateId)
      .populate('applications');

    if (!candidate) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy thông tin ứng viên'
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

export const updateCandidateProfile = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      req.user.candidateId,
      {
        $set: req.body
      },
      { new: true, runValidators: true }
    );

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

export const getCandidateApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidateId: req.user.candidateId })
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

export const updateCandidateSkills = async (req, res) => {
  try {
    const { skills } = req.body;
    
    const candidate = await Candidate.findByIdAndUpdate(
      req.user.candidateId,
      { $set: { skills } },
      { new: true, runValidators: true }
    );

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

export const searchJobsBySkills = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.user.candidateId);
    
    // Lấy danh sách tên kỹ năng của ứng viên
    const candidateSkills = candidate.skills.map(skill => skill.name.toLowerCase());

    // Tìm các công việc có kỹ năng phù hợp
    const matchingJobs = await JobPost.find({
      status: 'open',
      deadline: { $gt: new Date() },
      'skillsRequired.name': { 
        $in: candidateSkills.map(skill => new RegExp(skill, 'i'))
      }
    })
    .populate('employerId', 'companyName')
    .sort({ datePosted: -1 });

    // Tính toán độ phù hợp cho mỗi công việc
    const jobsWithMatchScore = matchingJobs.map(job => {
      const matchingSkillsCount = job.skillsRequired.filter(
        reqSkill => candidateSkills.includes(reqSkill.name.toLowerCase())
      ).length;
      
      const matchScore = (matchingSkillsCount / job.skillsRequired.length) * 100;

      return {
        ...job.toObject(),
        matchScore: Math.round(matchScore)
      };
    });

    // Sắp xếp theo độ phù hợp
    jobsWithMatchScore.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      status: 'success',
      data: jobsWithMatchScore
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Saved Jobs
export const getSavedJobs = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.user.candidateId)
      .populate({
        path: 'savedJobs.jobId',
        populate: {
          path: 'employerId',
          select: 'companyName companyLogo'
        }
      });

    if (!candidate) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy thông tin ứng viên'
      });
    }

    // Filter out any null jobs (if job was deleted)
    const savedJobs = candidate.savedJobs
      .filter(item => item.jobId)
      .map(item => ({
        ...item.jobId.toObject(),
        savedAt: item.savedAt
      }));

    res.json({
      status: 'success',
      data: savedJobs
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

export const saveJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check if job exists
    const job = await JobPost.findById(jobId);
    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy việc làm'
      });
    }

    const candidate = await Candidate.findById(req.user.candidateId);

    // Check if already saved
    const alreadySaved = candidate.savedJobs.some(
      item => item.jobId.toString() === jobId
    );

    if (alreadySaved) {
      return res.status(400).json({
        status: 'error',
        message: 'Việc làm đã được lưu trước đó'
      });
    }

    // Add to saved jobs
    candidate.savedJobs.push({
      jobId: jobId,
      savedAt: new Date()
    });

    await candidate.save();

    res.json({
      status: 'success',
      message: 'Đã lưu việc làm'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

export const unsaveJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const candidate = await Candidate.findById(req.user.candidateId);

    // Remove from saved jobs
    candidate.savedJobs = candidate.savedJobs.filter(
      item => item.jobId.toString() !== jobId
    );

    await candidate.save();

    res.json({
      status: 'success',
      message: 'Đã bỏ lưu việc làm'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};