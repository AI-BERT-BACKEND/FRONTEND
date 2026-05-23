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

   register: async (payload) => {
     const { data } = await api.post('/api/auth/register', payload);
     return data;
   },
   
   getCurrentUser: async () => {
    const token = localStorage.getItem('token');

    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));

    return payload;
  },

};

export default authService;