import api from './api';

const gamificationService = {

  // Progress
  getProgress: async (userId) => {
    const { data } = await api.get(`/api/v1/gamification/${userId}/progress`);
    return data;
  },

  // Points
  getPoints: async (userId) => {
    const { data } = await api.get(`/api/v1/gamification/${userId}/points`);
    return data;
  },

  processPointsEvent: async (userId, eventData) => {
    const { data } = await api.post(`/api/v1/gamification/${userId}/points/events`, eventData);
    return data;
  },

  // Achievements
  getAchievements: async (userId) => {
    const { data } = await api.get(`/api/v1/gamification/${userId}/achievements`);
    return data;
  },

  unlockAchievement: async (userId, achievementData) => {
    const { data } = await api.post(`/api/v1/gamification/${userId}/achievements/unlock`, achievementData);
    return data;
  },

  // Subject Progress
  getSubjectsProgress: async (userId) => {
    const { data } = await api.get(`/api/v1/gamification/${userId}/subjects/progress`);
    return data;
  },

  updateSubjectsProgress: async (userId, progressData) => {
    const { data } = await api.post(`/api/v1/gamification/${userId}/subjects/progress`, progressData);
    return data;
  },

  syncSubjectsProgress: async (userId) => {
    const { data } = await api.post(`/api/v1/gamification/${userId}/subjects/progress/sync`);
    return data;
  },

  getSubjectProgress: async (userId, subjectId) => {
    const { data } = await api.get(`/api/v1/gamification/${userId}/subjects/${subjectId}/progress`);
    return data;
  },

  // Task Events
  notifyTaskCompleted: async (eventData) => {
    const { data } = await api.post('/api/v1/events/task-completed', eventData);
    return data;
  },
};

export default gamificationService;
