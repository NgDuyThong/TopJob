import { api } from './api';

// Candidate API
export const candidateService = {
  // Lấy thông tin hồ sơ ứng viên
  getProfile: async () => {
    try {
      const response = await api.get('/candidates/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cập nhật thông tin hồ sơ ứng viên
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/candidates/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy danh sách đơn ứng tuyển của ứng viên
  getApplications: async () => {
    try {
      const response = await api.get('/candidates/applications');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cập nhật kỹ năng ứng viên
  updateSkills: async (skills) => {
    try {
      const response = await api.put('/candidates/skills', { skills });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Tìm việc làm phù hợp với kỹ năng
  getRecommendedJobs: async () => {
    try {
      // backend route is '/candidates/matching-jobs'
      const response = await api.get('/candidates/matching-jobs');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy danh sách việc làm đã lưu
  getSavedJobs: async () => {
    try {
      const response = await api.get('/candidates/saved-jobs');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lưu việc làm
  saveJob: async (jobId) => {
    try {
      const response = await api.post(`/candidates/saved-jobs/${jobId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Bỏ lưu việc làm
  unsaveJob: async (jobId) => {
    try {
      const response = await api.delete(`/candidates/saved-jobs/${jobId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};