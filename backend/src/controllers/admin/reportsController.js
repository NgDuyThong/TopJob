import Account from '../../models/Account.js';
import JobPost from '../../models/JobPost.js';
import Application from '../../models/Application.js';

/**
 * Get reports data with date range filtering
 * @route GET /api/admin/reports
 * @access Admin only
 */
export const getReports = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      type = 'all'
    } = req.query;

    // Parse dates or use defaults (last 30 days)
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Set end date to end of day
    end.setHours(23, 59, 59, 999);
    // Set start date to start of day
    start.setHours(0, 0, 0, 0);

    const reports = {};

    // User registrations trend
    if (type === 'all' || type === 'users') {
      const userRegistrations = await Account.aggregate([
        {
          $match: {
            createdAt: { $gte: start, $lte: end }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);

      reports.userRegistrations = userRegistrations.map(item => ({
        date: item._id,
        count: item.count
      }));
    }

    // Job postings trend
    if (type === 'all' || type === 'jobs') {
      const jobPostings = await JobPost.aggregate([
        {
          $match: {
            datePosted: { $gte: start, $lte: end }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$datePosted' }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);

      reports.jobPostings = jobPostings.map(item => ({
        date: item._id,
        count: item.count
      }));
    }

    // Application submissions trend
    if (type === 'all' || type === 'applications') {
      const applicationSubmissions = await Application.aggregate([
        {
          $match: {
            submitDate: { $gte: start, $lte: end }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$submitDate' }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);

      reports.applicationSubmissions = applicationSubmissions.map(item => ({
        date: item._id,
        count: item.count
      }));
    }

    res.status(200).json({
      status: 'success',
      data: {
        dateRange: {
          start: start.toISOString(),
          end: end.toISOString()
        },
        ...reports
      }
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch reports',
      error: error.message
    });
  }
};

/**
 * Get summary statistics for reports page
 * @route GET /api/admin/reports/summary
 * @access Admin only
 */
export const getReportsSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Parse dates or use defaults (last 30 days)
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    end.setHours(23, 59, 59, 999);
    start.setHours(0, 0, 0, 0);

    // Calculate summary statistics
    const [
      totalNewUsers,
      totalNewJobs,
      totalNewApplications,
      candidatesByRole,
      jobsByStatus
    ] = await Promise.all([
      Account.countDocuments({
        createdAt: { $gte: start, $lte: end }
      }),
      JobPost.countDocuments({
        datePosted: { $gte: start, $lte: end }
      }),
      Application.countDocuments({
        submitDate: { $gte: start, $lte: end }
      }),
      Account.aggregate([
        {
          $match: {
            createdAt: { $gte: start, $lte: end }
          }
        },
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 }
          }
        }
      ]),
      JobPost.aggregate([
        {
          $match: {
            datePosted: { $gte: start, $lte: end }
          }
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        dateRange: {
          start: start.toISOString(),
          end: end.toISOString()
        },
        summary: {
          totalNewUsers,
          totalNewJobs,
          totalNewApplications,
          usersByRole: candidatesByRole.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {}),
          jobsByStatus: jobsByStatus.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {})
        }
      }
    });
  } catch (error) {
    console.error('Error fetching reports summary:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch reports summary',
      error: error.message
    });
  }
};
