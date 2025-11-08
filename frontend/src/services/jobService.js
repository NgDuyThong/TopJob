import { api } from './api';

// Job Posts API
export const jobService = {
  // Lấy tất cả việc làm với phân trang và bộ lọc
  getAllJobs: async (params = {}) => {
    try {
      const response = await api.get('/jobs', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Tìm kiếm việc làm với các bộ lọc
  searchJobs: async (filters = {}, page = 1, limit = 10) => {
    try {
      const params = {
        page,
        limit,
        ...filters
      };
      const response = await api.get('/jobs/search', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy việc làm mới nhất
  getRecentJobs: async () => {
    try {
      const response = await api.get('/jobs/recent');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy chi tiết việc làm
  getJobById: async (id) => {
    try {
      const response = await api.get(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Tăng lượt xem việc làm
  incrementJobViews: async (id) => {
    try {
      const response = await api.post(`/jobs/${id}/view`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Tạo việc làm mới (cho employer)
  createJob: async (jobData) => {
    try {
      const response = await api.post('/jobs', jobData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cập nhật việc làm (cho employer)
  updateJob: async (id, jobData) => {
    try {
      const response = await api.put(`/jobs/${id}`, jobData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Xóa việc làm (cho employer)
  deleteJob: async (id) => {
    try {
      const response = await api.delete(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy việc làm theo kỹ năng (cho candidate)
  getJobsBySkills: async () => {
    try {
      // backend route is '/candidates/matching-jobs'
      const response = await api.get('/candidates/matching-jobs');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};