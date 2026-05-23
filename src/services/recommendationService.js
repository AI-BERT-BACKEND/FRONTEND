import recommendationApi from './recommendationApi';

const recommendationService = {
  generateRecommendations: async (recommendationRequest) => {
    const { data } = await recommendationApi.post('/api/v1/recommendations', recommendationRequest);
    return data;
  },

  // Retorna el plan diario del estudiante. Acepta currentDate opcional para consultar por fecha.
  getDailyPlan: async (studentId, currentDate) => {
    const params = { studentId, ...(currentDate && { currentDate }) };
    const { data } = await recommendationApi.get(
      `/api/v1/recommendations/daily/${studentId}`,
      { params }
    );
    return data;
  },

  // Retorna la reorganización semanal. Acepta currentDate opcional.
  getWeeklyReorganization: async (studentId, currentDate) => {
    const params = { studentId, ...(currentDate && { currentDate }) };
    const { data } = await recommendationApi.get(
      `/api/v1/recommendations/weekly/${studentId}`,
      { params }
    );
    return data;
  },
};

export default recommendationService;
