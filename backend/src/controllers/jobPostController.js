import JobPost from '../models/JobPost.js';
import Employer from '../models/Employer.js';

export const createJobPost = async (req, res) => {
  try {
    // Validate deadline
    if (req.body.deadline && new Date(req.body.deadline) <= new Date()) {
      return res.status(400).json({
        status: 'error',
        message: 'Deadline phải lớn hơn ngày hiện tại'
      });
    }

    const jobPost = new JobPost({
      ...req.body,
      employerId: req.user.employerId
    });

    await jobPost.save();

    // Cập nhật jobPosts trong Employer
    await Employer.findByIdAndUpdate(req.user.employerId, {
      $push: {
        jobPosts: {
          jobId: jobPost._id,
          title: jobPost.title,
          deadline: jobPost.deadline
        }
      }
    });

    res.status(201).json({
      status: 'success',
      data: jobPost
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

export const updateJobPost = async (req, res) => {
  try {
    const job = await JobPost.findOne({
      _id: req.params.id,
      employerId: req.user.employerId
    });

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy bài đăng tuyển dụng'
      });
    }

    // Validate deadline nếu có update
    if (req.body.deadline && new Date(req.body.deadline) <= new Date()) {
      return res.status(400).json({
        status: 'error',
        message: 'Deadline phải lớn hơn ngày hiện tại'
      });
    }

    // Cập nhật thông tin job
    Object.assign(job, req.body);
    await job.save();

    // Cập nhật jobPosts trong Employer nếu title hoặc deadline thay đổi
    if (req.body.title || req.body.deadline) {
      await Employer.updateOne(
        { 
          _id: req.user.employerId,
          'jobPosts.jobId': job._id 
        },
        {
          $set: {
            'jobPosts.$.title': job.title,
            'jobPosts.$.deadline': job.deadline
          }
        }
      );
    }

    res.json({
      status: 'success',
      data: job
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

export const deleteJobPost = async (req, res) => {
  try {
    const job = await JobPost.findOneAndDelete({
      _id: req.params.id,
      employerId: req.user.employerId
    });

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy bài đăng tuyển dụng'
      });
    }

    // Xóa job khỏi danh sách jobPosts trong Employer
    await Employer.updateOne(
      { _id: req.user.employerId },
      { $pull: { jobPosts: { jobId: job._id } } }
    );

    res.json({
      status: 'success',
      message: 'Xóa bài đăng thành công'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

export const getJobPost = async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id)
      .populate('employerId', 'companyName field email phone address website');

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy bài đăng tuyển dụng'
      });
    }

    res.json({
      status: 'success',
      data: job
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

export const getAllJobPosts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10,
      city,
      position,
      language,
      salary,
      skills,
      employerId
    } = req.query;

    // Xây dựng query filters
    const filters = {
      status: 'open',
      deadline: { $gt: new Date() }
    };

    if (city) filters['location.city'] = new RegExp(city, 'i');
    if (position) filters['position.title'] = new RegExp(position, 'i');
    if (language) filters.language = new RegExp(language, 'i');
    if (salary) filters.salary = new RegExp(salary, 'i');
    if (employerId) filters.employerId = employerId;
    if (skills) {
      const skillsList = skills.split(',').map(s => s.trim());
      filters['skillsRequired.name'] = { 
        $in: skillsList.map(skill => new RegExp(skill, 'i'))
      };
    }

    const jobs = await JobPost.find(filters)
      .populate('employerId', 'companyName')
      .sort({ datePosted: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await JobPost.countDocuments(filters);

    res.json({
      status: 'success',
      data: {
        jobs,
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

export const searchJobPosts = async (req, res) => {
  try {
    const { 
      q = '', 
      page = 1, 
      limit = 10,
      category = '',
      location = '',
      salaryMin = '',
      salaryMax = '',
      experience = '',
      jobType = '',
      workMode = '',
      companySize = '',
      sortBy = 'relevance'
    } = req.query;

    console.log('Search params:', { q, category, location, experience, jobType, workMode, companySize });

    const searchRegex = new RegExp(q, 'i');
    const locationRegex = new RegExp(location, 'i');
    
    const filters = {
      status: 'open',
      deadline: { $gt: new Date() }
    };

    // Search by query
    if (q) {
      filters.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { 'position.title': searchRegex },
        { 'skillsRequired.name': searchRegex },
        { 'location.city': searchRegex }
      ];
    }

    // Filter by category - search in both title and position.title
    if (category) {
      const categoryRegex = new RegExp(category, 'i');
      if (!filters.$or) {
        filters.$or = [];
      }
      // Use $and to ensure category filter is combined with other conditions
      const categoryFilter = {
        $or: [
          { title: categoryRegex },
          { 'position.title': categoryRegex }
        ]
      };
      
      // If there's already an $or for search, combine them with $and
      if (q) {
        filters.$and = [
          { $or: filters.$or },
          categoryFilter
        ];
        delete filters.$or;
      } else {
        filters.$or = categoryFilter.$or;
      }
    }

    // Filter by location
    if (location) {
      filters['location.city'] = locationRegex;
    }

    // Filter by experience level
    if (experience) {
      filters['position.level'] = experience;
    }

    // Filter by job type
    if (jobType) {
      filters['position.type'] = jobType;
    }

    // Filter by work mode
    if (workMode) {
      filters['position.workMode'] = workMode;
    }

    // Filter by salary range
    if (salaryMin || salaryMax) {
      filters.salary = {};
      if (salaryMin) filters.salary.$gte = parseInt(salaryMin);
      if (salaryMax) filters.salary.$lte = parseInt(salaryMax);
    }

    console.log('MongoDB filters:', JSON.stringify(filters, null, 2));

    console.log('MongoDB filters:', JSON.stringify(filters, null, 2));

    // Xác định cách sắp xếp
    let sortOptions = {};
    switch(sortBy) {
      case 'newest':
        sortOptions = { datePosted: -1 };
        break;
      case 'salary-high':
        sortOptions = { salary: -1 };
        break;
      case 'salary-low':
        sortOptions = { salary: 1 };
        break;
      case 'relevance':
      default:
        sortOptions = { datePosted: -1 };
    }

    // Get jobs with populated employer
    let jobs = await JobPost.find(filters)
      .populate('employerId', 'companyName companySize')
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit) * 2); // Get more to filter by companySize

    // Filter by company size (after populate)
    if (companySize) {
      jobs = jobs.filter(job => job.employerId && job.employerId.companySize === companySize);
      // Limit to requested limit after filtering
      jobs = jobs.slice(0, parseInt(limit));
    }

    // Count total with companySize filter applied
    let total;
    if (companySize) {
      // For companySize, we need to get all matching jobs and filter
      const allJobs = await JobPost.find(filters).populate('employerId', 'companySize');
      total = allJobs.filter(job => job.employerId && job.employerId.companySize === companySize).length;
    } else {
      total = await JobPost.countDocuments(filters);
    }

    res.json({
      status: 'success',
      data: {
        jobs,
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

export const getRecentJobPosts = async (req, res) => {
  try {
    const jobs = await JobPost.find({
      status: 'open',
      deadline: { $gt: new Date() }
    })
    .populate('employerId', 'companyName')
    .sort({ datePosted: -1 })
    .limit(10);

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

export const incrementJobViews = async (req, res) => {
  try {
    const job = await JobPost.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy bài đăng tuyển dụng'
      });
    }

    res.json({
      status: 'success',
      data: { views: job.views }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};