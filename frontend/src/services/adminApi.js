import { api } from './api';

/**
 * Admin API Service
 * All endpoints require admin authentication
 */

const adminApi = {
  // ==================== Statistics ====================

  /**
   * Get dashboard statistics
   */
  getStatistics: async () => {
    const response = await api.get('/admin/statistics');
    return response.data;
  },

  /**
   * Get recent jobs for dashboard
   */
  getRecentJobs: async (limit = 5) => {
    const response = await api.get('/admin/statistics/recent-jobs', {
      params: { limit }
    });
    return response.data;
  },

  /**
   * Get recent applications for dashboard
   */
  getRecentApplications: async (limit = 5) => {
    const response = await api.get('/admin/statistics/recent-applications', {
      params: { limit }
    });
    return response.data;
  },

  // ==================== Users ====================

  /**
   * Get all users with pagination and filters
   */
  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  /**
   * Get user detail by ID
   */
  getUserDetail: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  /**
   * Update user status
   */
  updateUserStatus: async (id, status) => {
    const response = await api.put(`/admin/users/${id}/status`, { status });
    return response.data;
  },

  // ==================== Jobs ====================

  /**
   * Get all jobs with pagination and filters
   */
  getJobs: async (params = {}) => {
    const response = await api.get('/admin/jobs', { params });
    return response.data;
  },

  /**
   * Get job detail by ID
   */
  getJobDetail: async (id) => {
    const response = await api.get(`/admin/jobs/${id}`);
    return response.data;
  },

  /**
   * Update job status
   */
  updateJobStatus: async (id, status) => {
    const response = await api.put(`/admin/jobs/${id}/status`, { status });
    return response.data;
  },

  /**
   * Delete job
   */
  deleteJob: async (id) => {
    const response = await api.delete(`/admin/jobs/${id}`);
    return response.data;
  },

  // ==================== Companies ====================

  /**
   * Get all companies with pagination and search
   */
  getCompanies: async (params = {}) => {
    const response = await api.get('/admin/companies', { params });
    return response.data;
  },

  /**
   * Get company detail by ID
   */
  getCompanyDetail: async (id) => {
    const response = await api.get(`/admin/companies/${id}`);
    return response.data;
  },

  /**
   * Verify/Unverify company
   */
  verifyCompany: async (id, verified) => {
    const response = await api.put(`/admin/companies/${id}/verify`, { verified });
    return response.data;
  },

  // ==================== Applications ====================

  /**
   * Get all applications with pagination and filters
   */
  getApplications: async (params = {}) => {
    const response = await api.get('/admin/applications', { params });
    return response.data;
  },

  /**
   * Get application detail by ID
   */
  getApplicationDetail: async (id) => {
    const response = await api.get(`/admin/applications/${id}`);
    return response.data;
  },

  /**
   * Update application status
   */
  updateApplicationStatus: async (id, status) => {
    const response = await api.put(`/admin/applications/${id}/status`, { status });
    return response.data;
  },

  // ==================== Reports ====================

  /**
   * Get reports data with date range
   */
  getReports: async (params = {}) => {
    const response = await api.get('/admin/reports', { params });
    return response.data;
  },

  /**
   * Get reports summary
   */
  getReportsSummary: async (params = {}) => {
    const response = await api.get('/admin/reports/summary', { params });
    return response.data;
  }
};

export default adminApi;
