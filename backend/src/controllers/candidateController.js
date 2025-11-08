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

    // Sync to Neo4j
    try {
      const neo4jService = (await import('../services/neo4jService.js')).default;
      await neo4jService.createOrUpdateCandidate(candidate.toObject());
      console.log('✅ [Neo4j] Synced candidate update:', candidate._id);
    } catch (neo4jError) {
      console.error('⚠️ [Neo4j] Failed to sync candidate update:', neo4jError.message);
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

    // Sync skills to Neo4j (quan trọng cho recommendations)
    try {
      const neo4jService = (await import('../services/neo4jService.js')).default;
      await neo4jService.createOrUpdateCandidate(candidate.toObject());
      if (skills && skills.length > 0) {
        await neo4jService.addCandidateSkills(candidate._id.toString(), skills);
      }
      console.log('✅ [Neo4j] Synced candidate skills:', candidate._id);
    } catch (neo4jError) {
      console.error('⚠️ [Neo4j] Failed to sync skills:', neo4jError.message);
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

export const searchJobsBySkills = async (req, res) => {
  try {
    // ==================== NEO4J VERSION ====================
    // Sử dụng Neo4j Graph Database để tìm jobs phù hợp
    // Nhanh hơn và chính xác hơn MongoDB
    
    const neo4jService = (await import('../services/neo4jService.js')).default;
    const candidateId = req.user.profileId || req.user.candidateId;

    console.log('🔍 [Neo4j] Finding matching jobs for candidate:', candidateId);

    // Query Neo4j graph database
    const recommendations = await neo4jService.recommendJobsForCandidate(
      candidateId.toString(),
      20
    );

    if (recommendations.length === 0) {
      return res.json({
        status: 'success',
        data: [],
        message: 'Chưa có việc làm phù hợp. Hãy cập nhật thêm kỹ năng!'
      });
    }

    // Enrich với MongoDB data
    const jobsWithMatchScore = await Promise.all(
      recommendations.map(async (rec) => {
        const job = await JobPost.findById(rec.jobId)
          .populate('employerId', 'companyName email phone industry')
          .lean();
        
        if (!job) return null;

        return {
          ...job,
          matchScore: Math.round(rec.matchScore * 100), // Convert to percentage
          matchingSkillsCount: rec.matchingSkills,
          totalRequiredSkills: rec.totalRequired,
          matchingSkills: rec.matchedSkillNames
        };
      })
    );

    // Filter và sort
    const validJobs = jobsWithMatchScore.filter(job => job !== null);
    validJobs.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      status: 'success',
      data: validJobs,
      source: 'neo4j' // Đánh dấu data từ Neo4j
    });
  } catch (error) {
    console.error('❌ Error in searchJobsBySkills:', error);
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