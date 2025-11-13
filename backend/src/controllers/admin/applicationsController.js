import Application from '../../models/Application.js';

/**
 * Get all applications with pagination, search, and filters
 * @route GET /api/admin/applications
 * @access Admin only
 */
export const getApplications = async (req, res) => {
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
      query['status.name'] = status;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get applications with populated data
    let applications = await Application.find(query)
      .populate('candidateId', 'fullName email phone')
      .populate({
        path: 'jobpostId',
        select: 'title',
        populate: {
          path: 'employerId',
          select: 'companyName'
        }
      })
      .sort({ submitDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Search filter (applied after fetching)
    if (search) {
      const searchLower = search.toLowerCase();
      applications = applications.filter(app => {
        const candidateName = app.candidateSummary?.fullName?.toLowerCase() || 
                             app.candidateId?.fullName?.toLowerCase() || '';
        const jobTitle = app.jobSummary?.title?.toLowerCase() || 
                        app.jobpostId?.title?.toLowerCase() || '';
        const companyName = app.jobSummary?.employerName?.toLowerCase() || 
                           app.jobpostId?.employerId?.companyName?.toLowerCase() || '';
        
        return candidateName.includes(searchLower) ||
               jobTitle.includes(searchLower) ||
               companyName.includes(searchLower);
      });
    }

    // Get total count for pagination
    const totalItems = await Application.countDocuments(query);


    // Format response
    const formattedApplications = applications.map(app => ({
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
      data: {
        applications: formattedApplications,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalItems / parseInt(limit)),
          totalItems,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch applications',
      error: error.message
    });
  }
};

/**
 * Get application detail by ID
 * @route GET /api/admin/applications/:id
 * @access Admin only
 */
export const getApplicationDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findById(id)
      .populate('candidateId', 'fullName email phone address education experience skills')
      .populate({
        path: 'jobpostId',
        select: 'title description salary location deadline',
        populate: {
          path: 'employerId',
          select: 'companyName email phone address'
        }
      });

    if (!application) {
      return res.status(404).json({
        status: 'error',
        message: 'Application not found'
      });
    }

    // Build status history (for now just current status, can be enhanced)
    const statusHistory = [
      {
        status: application.status?.name || 'Submitted',
        timestamp: application.status?.updatedAt || application.submitDate
      }
    ];

    res.status(200).json({
      status: 'success',
      data: {
        ...application.toObject(),
        statusHistory
      }
    });
  } catch (error) {
    console.error('Error fetching application detail:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch application detail',
      error: error.message
    });
  }
};


/**
 * Update application status
 * @route PUT /api/admin/applications/:id/status
 * @access Admin only
 */
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['Submitted', 'Reviewed', 'Interviewed', 'Hired', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const application = await Application.findByIdAndUpdate(
      id,
      { 
        'status.name': status,
        'status.date': new Date()
      },
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({
        status: 'error',
        message: 'Application not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Application status updated successfully',
      data: application
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update application status',
      error: error.message
    });
  }
};
