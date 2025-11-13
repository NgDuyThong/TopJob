import Employer from '../../models/Employer.js';
import JobPost from '../../models/JobPost.js';
import Application from '../../models/Application.js';
import Account from '../../models/Account.js';

/**
 * Get all companies with pagination and search
 * @route GET /api/admin/companies
 * @access Admin only
 */
export const getCompanies = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = 'all'
    } = req.query;

    // Build query
    const query = {};

    // Search filter
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { field: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get companies
    const companies = await Employer.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalItems = await Employer.countDocuments(query);

    // Calculate statistics for each company
    let companiesWithStats = await Promise.all(
      companies.map(async (company) => {
        // Count active jobs
        const activeJobsCount = await JobPost.countDocuments({
          employerId: company._id,
          status: 'open'
        });

        // Count total applications for this company's jobs
        const companyJobs = await JobPost.find({ employerId: company._id }).select('_id');
        const jobIds = companyJobs.map(job => job._id);
        const totalApplicationsCount = await Application.countDocuments({
          jobpostId: { $in: jobIds }
        });

        // Get company account info
        const account = await Account.findOne({
          employerId: company._id
        });

        return {
          _id: company._id,
          companyName: company.companyName,
          field: company.field || 'N/A',
          companySize: company.companySize,
          address: company.address || 'N/A',
          email: company.email,
          phone: company.phone || 'N/A',
          verified: account && account.status === 'active' ? true : false,
          accountId: account ? account._id : null,
          status: account ? account.status : 'inactive',
          activeJobsCount,
          totalApplicationsCount,
          createdAt: company.createdAt
        };
      })
    );

    // Filter by status if specified
    if (status !== 'all') {
      companiesWithStats = companiesWithStats.filter(company => company.status === status);
    }

    res.status(200).json({
      status: 'success',
      data: {
        companies: companiesWithStats,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalItems / parseInt(limit)),
          totalItems,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch companies',
      error: error.message
    });
  }
};

/**
 * Get company detail by ID
 * @route GET /api/admin/companies/:id
 * @access Admin only
 */
export const getCompanyDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Employer.findById(id);

    if (!company) {
      return res.status(404).json({
        status: 'error',
        message: 'Company not found'
      });
    }

    // Get all jobs for this company
    const jobs = await JobPost.find({ employerId: id })
      .sort({ datePosted: -1 })
      .select('title status deadline applicationsCount datePosted');

    // Calculate statistics
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(job => job.status === 'open').length;
    
    const totalApplications = jobs.reduce((sum, job) => sum + job.applicationsCount, 0);

    // Check verification status
    const account = await Account.findOne({ employerId: id });

    res.status(200).json({
      status: 'success',
      data: {
        ...company.toObject(),
        verified: account ? account.status === 'active' : false,
        accountStatus: account ? account.status : null,
        jobs: jobs.map(job => ({
          _id: job._id,
          title: job.title,
          status: job.status,
          deadline: job.deadline,
          applicationsCount: job.applicationsCount,
          datePosted: job.datePosted
        })),
        statistics: {
          totalJobs,
          activeJobs,
          totalApplications
        }
      }
    });
  } catch (error) {
    console.error('Error fetching company detail:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch company detail',
      error: error.message
    });
  }
};


/**
 * Verify/Unverify company (update account status)
 * @route PUT /api/admin/companies/:id/verify
 * @access Admin only
 */
export const verifyCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { verified } = req.body;

    // Check if company exists
    const company = await Employer.findById(id);
    if (!company) {
      return res.status(404).json({
        status: 'error',
        message: 'Company not found'
      });
    }

    // Find and update the associated account
    const account = await Account.findOne({ employerId: id });
    if (!account) {
      return res.status(404).json({
        status: 'error',
        message: 'Company account not found'
      });
    }

    // Update account status based on verification
    account.status = verified ? 'active' : 'pending';
    await account.save();

    res.status(200).json({
      status: 'success',
      message: `Company ${verified ? 'verified' : 'unverified'} successfully`,
      data: {
        companyId: company._id,
        companyName: company.companyName,
        verified: account.status === 'active',
        accountStatus: account.status
      }
    });
  } catch (error) {
    console.error('Error verifying company:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to verify company',
      error: error.message
    });
  }
};
