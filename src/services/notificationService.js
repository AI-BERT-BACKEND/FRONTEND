import api from './api';

const notificationService = {
  getMyNotifications: async () => {
    const { data } = await api.get('/api/v1/notifications/me');
    return data;
  },

  getUnreadNotifications: async () => {
    const { data } = await api.get('/api/v1/notifications/me/unread');
    return data;
  },

  getStudySuggestions: async () => {
    const { data } = await api.get('/api/v1/notifications/me/suggestions');
    return data;
  },

  getUnreadCount: async () => {
    const { data } = await api.get('/api/v1/notifications/me/count');
    return data;
  },

  getAlertNotifications: async () => {
    const { data } = await api.get('/api/v1/notifications/me/alerts');
    return data;
  },

  markAsRead: async (notificationId) => {
    const { data } = await api.put(`/api/v1/notifications/${notificationId}/read`);
    return data;
  },

  markAllAsRead: async () => {
    const { data } = await api.put('/api/v1/notifications/me/read-all');
    return data;
  },

  createNotification: async (notificationData) => {
    const { data } = await api.post('/api/v1/notifications', notificationData);
    return data;
  },

  getTopStudySuggestion: async () => {
    const { data } = await api.get('/api/v1/stats/suggestion');
    return data;
  },

  getStatsAlerts: async () => {
    const { data } = await api.get('/api/v1/stats/alerts');
    return data;
  },
};

export default notificationService;