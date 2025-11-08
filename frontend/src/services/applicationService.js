import { api } from './api';

// Applications API
export const applicationService = {
  // Nộp đơn ứng tuyển
  submitApplication: async (applicationData) => {
    try {
      const formData = new FormData();
      formData.append('jobpostId', applicationData.jobpostId);
      formData.append('coverLetter', applicationData.coverLetter);
      if (applicationData.resumeFile) {
        formData.append('resume', applicationData.resumeFile); // Đổi từ 'resumeFile' thành 'resume'
      }

      const response = await api.post('/applications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy đơn ứng tuyển theo ID
  getApplicationById: async (id) => {
    try {
      const response = await api.get(`/applications/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Rút đơn ứng tuyển
  withdrawApplication: async (id) => {
    try {
      const response = await api.delete(`/applications/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cập nhật trạng thái đơn ứng tuyển (cho employer)
  updateApplicationStatus: async (id, status) => {
    try {
      const response = await api.put(`/applications/${id}`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy đơn ứng tuyển theo job (cho employer)
  getApplicationsByJob: async (jobId) => {
    try {
      const response = await api.get(`/applications/job/${jobId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy đơn ứng tuyển theo candidate (cho candidate)
  getApplicationsByCandidate: async (candidateId) => {
    try {
      const response = await api.get(`/applications/candidate/${candidateId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};