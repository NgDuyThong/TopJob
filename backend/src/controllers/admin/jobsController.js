import JobPost from '../../models/JobPost.js';
import Application from '../../models/Application.js';

/**
 * Get all jobs with pagination, search, and filters
 * @route GET /api/admin/jobs
 * @access Admin only
 */
export const getJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = 'all'
    } = req.query;

    // Build query
    const query = {};

    // Status filter
    if (status !== 'all') {
      query.status = status;
    }

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get jobs with populated employer data
    const jobs = await JobPost.find(query)
      .populate('employerId', 'companyName email')
      .sort({ datePosted: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalItems = await JobPost.countDocuments(query);

    // Format response
    const formattedJobs = jobs.map(job => ({
      _id: job._id,
      title: job.title,
      companyName: job.employerId?.companyName || 'Unknown Company',
      companyEmail: job.employerId?.email || 'N/A',
      location: job.location?.city || 'N/A',
      salary: job.salary,
      status: job.status,
      applicationsCount: job.applicationsCount,
      views: job.views,
      datePosted: job.datePosted,
      deadline: job.deadline
    }));

    res.status(200).json({
      status: 'success',
      data: {
        jobs: formattedJobs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalItems / parseInt(limit)),
          totalItems,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch jobs',
      error: error.message
    });
  }
};

/**
 * Get job detail by ID with applications
 * @route GET /api/admin/jobs/:id
 * @access Admin only
 */
export const getJobDetail = async (req, res) => {
  try {
    const { id } = req.params;

    // Get job with employer details
    const job = await JobPost.findById(id)
      .populate('employerId', 'companyName email phone address field companySize website');

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found'
      });
    }

    // Get applications for this job
    const applications = await Application.find({ jobpostId: id })
      .populate('candidateId', 'fullName email phone')
      .sort({ submitDate: -1 })
      .select('candidateSummary status submitDate');

    // Format applications
    const formattedApplications = applications.map(app => ({
      _id: app._id,
      candidateName: app.candidateSummary?.fullName || app.candidateId?.fullName || 'Unknown',
      candidateEmail: app.candidateSummary?.email || app.candidateId?.email || 'N/A',
      status: app.status?.name || 'Submitted',
      submitDate: app.submitDate
    }));

    res.status(200).json({
      status: 'success',
      data: {
        ...job.toObject(),
        applications: formattedApplications
      }
    });
  } catch (error) {
    console.error('Error fetching job detail:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch job detail',
      error: error.message
    });
  }
};

/**
 * Update job status
 * @route PUT /api/admin/jobs/:id/status
 * @access Admin only
 */
export const updateJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['open', 'closed'].includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid status. Must be open or closed'
      });
    }

    const job = await JobPost.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate('employerId', 'companyName');

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Job status updated successfully',
      data: job
    });
  } catch (error) {
    console.error('Error updating job status:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update job status',
      error: error.message
    });
  }
};

/**
 * Delete job
 * @route DELETE /api/admin/jobs/:id
 * @access Admin only
 */
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await JobPost.findByIdAndDelete(id);

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found'
      });
    }

    // Also delete all applications for this job
    await Application.deleteMany({ jobpostId: id });

    res.status(200).json({
      status: 'success',
      message: 'Job and related applications deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete job',
      error: error.message
    });
  }
};
