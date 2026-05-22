import api from './api';

const enginePlanningService = {

  adjustEstimations: async (payload) => {
    const { data } = await api.post('/planning/estimations/adjust', payload);
    return data;
  },

  getWorkloadBalance: async (weekStartDate) => {
    const params = weekStartDate ? { weekStartDate } : {};
    const { data } = await api.get('/planning/balance', { params });
    return data;
  },

  notifyTaskChange: async (eventData) => {
    const { data } = await api.post('/planning/events/task-change', eventData);
    return data;
  },

  getPrioritizationCriticalTasks: async (forceRecalculate = false, payload = {}) => {
    const params = { forceRecalculate };
    const { data } = await api.post('/planning/prioritization/critical', payload, { params });
    return data;
  },

  getPrioritizedTasks: async (forceRecalculate = false) => {
    const params = { forceRecalculate };
    const { data } = await api.get('/planning/prioritization', { params });
    return data;
  },

  getHighRiskTasks: async () => {
    const { data } = await api.get('/planning/risk/high-risk');
    return data;
  },

  generateDistribution: async (weekStartDate) => {
    const params = weekStartDate ? { weekStartDate } : {};
    const { data } = await api.post('/planning/distribution', null, { params });
    return data;
  },

  getRecommendationsCritical: async (forceRecalculate = false, payload = {}) => {
    const params = { forceRecalculate };
    const { data } = await api.post('/planning/recommendations/critical', payload, { params });
    return data;
  },

  reorganizeSchedule: async () => {
    const { data } = await api.post('/planning/rebalance/reorganize');
    return data;
  },

  reportFailure: async (failureData) => {
    const { data } = await api.post('/planning/rebalance/failure', failureData);
    return data;
  }
};

export default enginePlanningService;
