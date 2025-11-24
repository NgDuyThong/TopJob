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
      
      // Lấy thông tin lỗi chi tiết từ response
      const errorData = error.response?.data;
      
      if (errorData) {
        // Nếu có danh sách lỗi chi tiết (từ password validator)
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const customError = new Error(errorData.message || 'Mật khẩu không đáp ứng yêu cầu');
          customError.errors = errorData.errors; // Gắn danh sách lỗi vào error object
          throw customError;
        }
        
        // Nếu chỉ có message thông thường
        throw new Error(errorData.message || 'Có lỗi xảy ra khi đăng ký');
      }
      
      throw new Error(error.message || 'Có lỗi xảy ra khi đăng ký');
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
  },

  // Quên mật khẩu
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Error requesting password reset:', error);
      throw error;
    }
  },

  // Đặt lại mật khẩu
  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password', { 
        token, 
        newPassword 
      });
      return response.data;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }
};

export default authService;