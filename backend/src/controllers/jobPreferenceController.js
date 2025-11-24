import JobPreference from '../models/JobPreference.js';

/**
 * Lấy job preferences của candidate
 */
export const getJobPreferences = async (req, res) => {
  try {
    const candidateId = req.user.profileId || req.user.candidateId;

    let preferences = await JobPreference.findOne({ candidateId });

    // Nếu chưa có preferences, tạo mới với giá trị mặc định
    if (!preferences) {
      preferences = new JobPreference({
        candidateId,
        preferredLocations: [],
        salaryRange: { min: 0, max: 100 },
        jobTypes: [],
        experienceLevels: [],
        companyTypes: [],
        industries: [],
        preferredSkills: [],
        willingToRelocate: false,
        receiveRecommendations: true,
        notificationFrequency: 'weekly'
      });
      await preferences.save();
    }

    res.json({
      status: 'success',
      data: preferences
    });
  } catch (error) {
    console.error('Error getting job preferences:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Cập nhật job preferences
 */
export const updateJobPreferences = async (req, res) => {
  try {
    const candidateId = req.user.profileId || req.user.candidateId;
    const updateData = req.body;

    // Validate salary range
    if (updateData.salaryRange) {
      if (updateData.salaryRange.min < 0 || updateData.salaryRange.max < 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Mức lương không hợp lệ'
        });
      }
      if (updateData.salaryRange.min > updateData.salaryRange.max) {
        return res.status(400).json({
          status: 'error',
          message: 'Mức lương tối thiểu không thể lớn hơn mức lương tối đa'
        });
      }
    }

    // Tìm và cập nhật, hoặc tạo mới nếu chưa có
    let preferences = await JobPreference.findOneAndUpdate(
      { candidateId },
      { 
        candidateId,
        ...updateData 
      },
      { 
        new: true, 
        upsert: true,
        runValidators: true 
      }
    );

    res.json({
      status: 'success',
      message: 'Đã lưu cài đặt gợi ý việc làm',
      data: preferences
    });
  } catch (error) {
    console.error('Error updating job preferences:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Reset job preferences về mặc định
 */
export const resetJobPreferences = async (req, res) => {
  try {
    const candidateId = req.user.profileId || req.user.candidateId;

    const preferences = await JobPreference.findOneAndUpdate(
      { candidateId },
      {
        candidateId,
        preferredLocations: [],
        salaryRange: { min: 0, max: 100 },
        jobTypes: [],
        experienceLevels: [],
        companyTypes: [],
        industries: [],
        preferredSkills: [],
        willingToRelocate: false,
        receiveRecommendations: true,
        notificationFrequency: 'weekly'
      },
      { 
        new: true, 
        upsert: true 
      }
    );

    res.json({
      status: 'success',
      message: 'Đã đặt lại cài đặt về mặc định',
      data: preferences
    });
  } catch (error) {
    console.error('Error resetting job preferences:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
