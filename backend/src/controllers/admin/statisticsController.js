import Account from '../../models/Account.js';
import JobPost from '../../models/JobPost.js';
import Application from '../../models/Application.js';

/**
 * Get dashboard statistics
 * @route GET /api/admin/statistics
 * @access Admin only
 */
export const getStatistics = async (req, res) => {
  try {
    // Calculate all statistics in parallel for better performance
    const [
      totalUsers,
      totalCandidates,
      totalEmployers,
      totalJobs,
      activeJobs,
      totalApplications,
      pendingApplications,
      totalViewsResult
    ] = await Promise.all([
      // Total users (all accounts)
      Account.countDocuments(),
      
      // Total candidates
      Account.countDocuments({ type: 'candidate' }),
      
      // Total employers
      Account.countDocuments({ type: 'employer' }),
      
      // Total jobs
      JobPost.countDocuments(),
      
      // Active jobs (status: open)
      JobPost.countDocuments({ status: 'open' }),
      
      // Total applications
      Application.countDocuments(),
      
      // Pending applications (status: Submitted)
      Application.countDocuments({ 'status.name': 'Submitted' }),
      
      // Total views across all jobs
      JobPost.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: '$views' }
          }
        }
      ])
    ]);

    // Extract total views from aggregation result
    const totalViews = totalViewsResult.length > 0 ? totalViewsResult[0].total : 0;

    // Return statistics
    res.status(200).json({
      status: 'success',
      data: {
        totalUsers,
        totalCandidates,
        totalEmployers,
        totalJobs,
        activeJobs,
        totalApplications,
        pendingApplications,
        totalViews
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};

/**
 * Get recent jobs for dashboard
 * @route GET /api/admin/statistics/recent-jobs
 * @access Admin only
 */
export const getRecentJobs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const recentJobs = await JobPost.find()
      .populate('employerId', 'companyName')
      .sort({ datePosted: -1 })
      .limit(limit)
      .select('title status applicationsCount views datePosted location salary');

    // Format the response
    const formattedJobs = recentJobs.map(job => ({
      _id: job._id,
      title: job.title,
      companyName: job.employerId?.companyName || 'Unknown Company',
      location: job.location?.city || 'N/A',
      salary: job.salary,
      status: job.status,
      applicationsCount: job.applicationsCount,
      views: job.views,
      datePosted: job.datePosted
    }));

    res.status(200).json({
      status: 'success',
      data: formattedJobs
    });
  } catch (error) {
    console.error('Error fetching recent jobs:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch recent jobs',
      error: error.message
    });
  }
};

/**
 * Get recent applications for dashboard
 * @route GET /api/admin/statistics/recent-applications
 * @access Admin only
 */
export const getRecentApplications = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const recentApplications = await Application.find()
      .populate('candidateId', 'fullName email')
      .populate({
        path: 'jobpostId',
        select: 'title',
        populate: {
          path: 'employerId',
          select: 'companyName'
        }
      })
      .sort({ submitDate: -1 })
      .limit(limit)
      .select('candidateSummary jobSummary status submitDate');

    // Format the response
    const formattedApplications = recentApplications.map(app => ({
      _id: app._id,
      candidateName: app.candidateSummary?.fullName || app.candidateId?.fullName || 'Unknown',
      candidateEmail: app.candidateSummary?.email || app.candidateId?.email || 'N/A',
      jobTitle: app.jobSummary?.title || app.jobpostId?.title || 'Unknown Job',
      companyName: app.jobSummary?.employerName || app.jobpostId?.employerId?.companyName || 'Unknown Company',
      status: app.status?.name || 'Submitted',
      submitDate: app.submitDate
    }));

    res.status(200).json({
      status: 'success',
      data: formattedApplications
    });
  } catch (error) {
    console.error('Error fetching recent applications:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch recent applications',
      error: error.message
    });
  }
};
