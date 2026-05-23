import api from './api';

const recommendationService = {
  generateRecommendations: async (recommendationRequest) => {
    const { data } = await api.post('/api/v1/recommendations', recommendationRequest);
    return data;
  },

  getDailyPlan: async (studentId) => {
    const { data } = await api.get(`/api/v1/recommendations/daily/${studentId}`);
    return data;
  },

  getWeeklyReorganization: async (studentId) => {
    const { data } = await api.get(`/api/v1/recommendations/weekly/${studentId}`);
    return data;
  },
};

export default recommendationService;