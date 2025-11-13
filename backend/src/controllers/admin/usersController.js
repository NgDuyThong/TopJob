import Account from '../../models/Account.js';
import Candidate from '../../models/Candidate.js';
import Employer from '../../models/Employer.js';

/**
 * Get all users with pagination, search, and filters
 * @route GET /api/admin/users
 * @access Admin only
 */
export const getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      role = 'all',
      status = 'all'
    } = req.query;

    // Build query
    const query = {};

    // Role filter
    if (role !== 'all') {
      query.type = role;
    }

    // Status filter
    if (status !== 'all') {
      query.status = status;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get users with populated profile data
    let users = await Account.find(query)
      .populate('candidateId', 'fullName email phone')
      .populate('employerId', 'companyName email phone')
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Search filter (applied after fetching for simplicity)
    if (search) {
      const searchLower = search.toLowerCase();
      users = users.filter(user => {
        const username = user.username?.toLowerCase() || '';
        const candidateName = user.candidateId?.fullName?.toLowerCase() || '';
        const candidateEmail = user.candidateId?.email?.toLowerCase() || '';
        const companyName = user.employerId?.companyName?.toLowerCase() || '';
        const companyEmail = user.employerId?.email?.toLowerCase() || '';
        
        return username.includes(searchLower) ||
               candidateName.includes(searchLower) ||
               candidateEmail.includes(searchLower) ||
               companyName.includes(searchLower) ||
               companyEmail.includes(searchLower);
      });
    }

    // Get total count for pagination
    const totalItems = await Account.countDocuments(query);

    // Format response
    const formattedUsers = users.map(user => ({
      _id: user._id,
      username: user.username,
      type: user.type,
      status: user.status,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      profile: user.type === 'candidate' 
        ? {
            fullName: user.candidateId?.fullName || 'N/A',
            email: user.candidateId?.email || 'N/A',
            phone: user.candidateId?.phone || 'N/A'
          }
        : user.type === 'employer'
        ? {
            companyName: user.employerId?.companyName || 'N/A',
            email: user.employerId?.email || 'N/A',
            phone: user.employerId?.phone || 'N/A'
          }
        : null
    }));

    res.status(200).json({
      status: 'success',
      data: {
        users: formattedUsers,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalItems / parseInt(limit)),
          totalItems,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

/**
 * Get user detail by ID
 * @route GET /api/admin/users/:id
 * @access Admin only
 */
export const getUserDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await Account.findById(id)
      .populate('candidateId')
      .populate('employerId')
      .select('-password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    console.error('Error fetching user detail:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user detail',
      error: error.message
    });
  }
};

/**
 * Update user status
 * @route PUT /api/admin/users/:id/status
 * @access Admin only
 */
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['active', 'locked', 'pending'].includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid status. Must be active, locked, or pending'
      });
    }

    const user = await Account.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'User status updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update user status',
      error: error.message
    });
  }
};
