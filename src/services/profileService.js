import api from './api';

const profileService = {
  getAdminUserById: async (userId) => {
    const { data } = await api.get(`/api/admin/users/${userId}`);
    return data;
  },

  updateAdminUser: async (userId, payload) => {
    const { data } = await api.put(`/api/admin/users/${userId}`, payload);
    return data;
  },

  deleteAdminUser: async (userId) => {
    const { data } = await api.delete(`/api/admin/users/${userId}`);
    return data;
  },

  updateAdminUserStatus: async (userId, status) => {
    const { data } = await api.put(`/api/admin/users/${userId}/status`, null, { params: { status } });
    return data;
  },

  updateAdminUserRole: async (userId, payload) => {
    const { data } = await api.put(`/api/admin/users/${userId}/role`, payload);
    return data;
  },

  getAdminUsers: async (params) => {
    const { data } = await api.get('/api/admin/users', { params });
    return data;
  },

  updatePersonalProfile: async (userId, payload) => {
    const { data } = await api.put(`/api/profile/${userId}`, payload);
    return data;
  },

  deleteAccount: async (userId, currentPassword) => {
    const { data } = await api.delete(`/api/profile/${userId}`, { params: { currentPassword } });
    return data;
  },

  updateProfilePhoto: async (userId, formData) => {
    const { data } = await api.put(`/api/profile/${userId}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  changePassword: async (userId, payload) => {
    const { data } = await api.put(`/api/profile/${userId}/password`, payload);
    return data;
  },

  getAcademicProfile: async (userId) => {
    const { data } = await api.get(`/api/profile/${userId}/academic`);
    return data;
  },

  updateAcademicProfile: async (userId, payload) => {
    const { data } = await api.put(`/api/profile/${userId}/academic`, payload);
    return data;
  },

  verifyOtp: async (userId, otp) => {
    const { data } = await api.post('/api/auth/verify-otp', null, { params: { userId, otp } });
    return data;
  },

  resendVerification: async (email) => {
    const { data } = await api.post('/api/auth/resend-otp', null, { params: { email } });
    return data;
  },

  register: async (userData) => {
      const { data } = await api.post('/api/auth/register', userData);
      return data;
  },

  updateInternalUserAuth: async (id, payload) => {
    const { data } = await api.put(`/internal/users/${id}/auth`, payload);
    return data;
  },

  getInternalUserById: async (id) => {
    const { data } = await api.get(`/internal/users/${id}`);
    return data;
  },

  getInternalUserByEmail: async (email) => {
    const { data } = await api.get(`/internal/users/email/${email}`);
    return data;
  }
};

export default profileService;