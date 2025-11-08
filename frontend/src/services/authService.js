import { api } from './api.js';

export const authService = {
  // Đăng nhập
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      
      // Lưu token vào localStorage
      if (response.data.status === 'success' && response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('userType', response.data.data.type);
        localStorage.setItem('candidateId', response.data.data.candidateId || '');
        localStorage.setItem('employerId', response.data.data.employerId || '');
      }
      
      // Trả về data object cho LoginPage
      return {
        status: 'success',
        data: response.data.data
      };
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Đăng ký
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Error registering:', error);
      // Lấy message từ response nếu có
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi đăng ký';
      throw new Error(errorMessage);
    }
  },

  // Đăng xuất
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('candidateId');
    localStorage.removeItem('employerId');
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    return {
      type: localStorage.getItem('userType'),
      candidateId: localStorage.getItem('candidateId'),
      employerId: localStorage.getItem('employerId')
    };
  },

  // Kiểm tra token có hợp lệ không
  validateToken: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      const response = await api.post('/auth/validate-token');
      return response.data.status === 'success';
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }
};

export default authService;