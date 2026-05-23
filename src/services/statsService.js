import api from './api';

const statsService = {
  getDashboard: async () => {
    const { data } = await api.get('/api/stats/dashboard');
    return data;
  },

  getSubjectsStatistics: async () => {
    const { data } = await api.get('/api/stats/subjects');
    return data;
  },

  getSubjectStatistics: async (subjectId) => {
    const { data } = await api.get(`/api/stats/subjects/${subjectId}`);
    return data;
  },

  getGamification: async () => {
    const { data } = await api.get('/api/stats/gamification');
    return data;
  },

  getHealth: async () => {
    const { data } = await api.get('/health');
    return data;
  },
};

export default statsService;