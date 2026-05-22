import api from './api';

const authService = {

  login: async (credentials) => {
    const { data } = await api.post('/api/auth/login', credentials);
    return data;
  },

  logout: async () => {
    const { data } = await api.post('/api/auth/logout');
    return data;
  },

  forgotPassword: async (emailData) => {
    const { data } = await api.post('/api/auth/forgot-password', emailData);
    return data;
  },

  resetPassword: async (resetData) => {
    const { data } = await api.post('/api/auth/reset-password', resetData);
    return data;
  },

};

export default authService;