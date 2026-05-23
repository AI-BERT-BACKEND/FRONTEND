import planningApi from './planningApi';

const enginePlanningService = {

  // Solicita al motor que reajuste estimaciones de tiempo para tareas pendientes.
  adjustEstimations: async (payload) => {
    const { data: wrapper } = await planningApi.post('/planning/estimations/adjust', payload);
    return wrapper.data ?? wrapper;
  },

  getWorkloadBalance: async (weekStartDate) => {
    const params = weekStartDate ? { weekStartDate } : {};
    const { data: wrapper } = await planningApi.get('/planning/balance', { params });
    return wrapper.data ?? wrapper;
  },

  notifyTaskChange: async (eventData) => {
    const { data: wrapper } = await planningApi.post('/planning/events/task-change', eventData);
    return wrapper.data ?? wrapper;
  },

  getPrioritizationCriticalTasks: async (forceRecalculate = false, payload = {}) => {
    const params = { forceRecalculate };
    const { data: wrapper } = await planningApi.post('/planning/prioritization/critical', payload, { params });
    return wrapper.data ?? wrapper;
  },

  getPrioritizedTasks: async (forceRecalculate = false) => {
    const params = { forceRecalculate };
    const { data: wrapper } = await planningApi.get('/planning/prioritization', { params });
    return wrapper.data ?? wrapper;
  },

  getHighRiskTasks: async () => {
    const { data: wrapper } = await planningApi.get('/planning/risk/high-risk');
    return wrapper.data ?? wrapper;
  },

  generateDistribution: async (weekStartDate) => {
    const params = weekStartDate ? { weekStartDate } : {};
    const { data: wrapper } = await planningApi.post('/planning/distribution', null, { params });
    return wrapper.data ?? wrapper;
  },

  getRecommendationsCritical: async (forceRecalculate = false, payload = {}) => {
    const params = { forceRecalculate };
    const { data: wrapper } = await planningApi.post('/planning/recommendations/critical', payload, { params });
    return wrapper.data ?? wrapper;
  },

  reorganizeSchedule: async () => {
    const { data: wrapper } = await planningApi.post('/planning/rebalance/reorganize');
    return wrapper.data ?? wrapper;
  },

  // Reporta una falla en el plan de estudio para que el motor ajuste la distribución.
  reportFailure: async (failureData) => {
    const { data: wrapper } = await planningApi.post('/planning/rebalance/failure', failureData);
    return wrapper.data ?? wrapper;
  },
};

export default enginePlanningService;
