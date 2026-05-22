import api from './api';

const academicService = {
  getProfile: async () => {
    const { data } = await api.get('/academic/profile');
    return data;
  },

  updateProfile: async (profileData) => {
    const { data } = await api.put('/academic/profile', profileData);
    return data;
  },

  getSubjects: async () => {
    const { data } = await api.get('/academic/subjects');
    return data;
  },

  createSubject: async (subjectData) => {
    const { data } = await api.post('/academic/subjects', subjectData);
    return data;
  },

  getDashboardStats: async () => {
    const { data } = await api.get('/academic/dashboard-stats');
    return data;
  },

  getGoals: async () => {
    const { data } = await api.get('/academic/goals');
    return data;
  },

  createGoal: async (goalData) => {
    const { data } = await api.post('/academic/goals', goalData);
    return data;
  },
};

export default academicService;
