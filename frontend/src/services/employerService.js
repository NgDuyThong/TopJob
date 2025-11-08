import { api } from './api';

// Employer API
export const employerService = {
  // Lấy thông tin hồ sơ nhà tuyển dụng
  getProfile: async () => {
    try {
      const response = await api.get('/employers/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cập nhật thông tin hồ sơ nhà tuyển dụng
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/employers/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy danh sách việc làm đã đăng
  getPostedJobs: async () => {
    try {
      const response = await api.get('/employers/jobs');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy đơn ứng tuyển cho một việc làm
  getJobApplications: async (jobId) => {
    try {
      const response = await api.get(`/employers/jobs/${jobId}/applications`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy chi tiết đơn ứng tuyển
  getApplicationDetail: async (applicationId) => {
    try {
      const response = await api.get(`/employers/applications/${applicationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cập nhật trạng thái đơn ứng tuyển
  updateApplicationStatus: async (applicationId, status) => {
    try {
      const response = await api.put(`/employers/applications/${applicationId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Tìm ứng viên phù hợp cho việc làm
  getMatchingCandidates: async (jobId) => {
    try {
      const response = await api.get(`/employers/jobs/${jobId}/candidates`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Tìm kiếm ứng viên
  searchCandidates: async (params) => {
    try {
      const response = await api.get('/employers/candidates/search', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy chi tiết ứng viên
  getCandidateDetail: async (candidateId) => {
    try {
      const response = await api.get(`/employers/candidates/${candidateId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy thống kê
  getStatistics: async () => {
    try {
      const response = await api.get('/employers/statistics');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lưu ứng viên
  saveCandidate: async (candidateId) => {
    try {
      const response = await api.post(`/employers/candidates/${candidateId}/save`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Bỏ lưu ứng viên
  unsaveCandidate: async (candidateId) => {
    try {
      const response = await api.delete(`/employers/candidates/${candidateId}/save`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy danh sách ứng viên đã lưu
  getSavedCandidates: async () => {
    try {
      const response = await api.get('/employers/saved-candidates');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};