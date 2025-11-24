import { api } from './api';

export const jobPreferenceService = {
  // Lấy job preferences
  getPreferences: async () => {
    try {
      const response = await api.get('/job-preferences');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cập nhật job preferences
  updatePreferences: async (preferences) => {
    try {
      const response = await api.put('/job-preferences', preferences);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Reset về mặc định
  resetPreferences: async () => {
    try {
      const response = await api.post('/job-preferences/reset');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
