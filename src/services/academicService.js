import api from './academicApi';

const academicService = {

  getSummary: async () => {
    const { data } = await api.get('/api/v1/academic/summary');
    return data;
  },

  getAcademicWeight: async (subjectId) => {
    let studentId;
    try {
      const token = localStorage.getItem('token');
      const payload = JSON.parse(atob(token.split('.')[1]));
      studentId = payload.id || payload.userId || payload.sub;
    } catch { /* */ }
    const { data } = await api.get('/api/v1/academic/weight', { params: { subjectId, studentId } });
    return data;
  },


  getSubjects: async () => {
    const { data } = await api.get('/api/v1/subjects');
    return data;
  },

  getSubjectById: async (subjectId) => {
    const { data } = await api.get(`/api/v1/subjects/${subjectId}`);
    return data;
  },

  createSubject: async (subjectData) => {
    const { data } = await api.post('/api/v1/subjects', subjectData);
    return data;
  },

  updateSubject: async (subjectId, subjectData) => {
    const { data } = await api.put(`/api/v1/subjects/${subjectId}`, subjectData);
    return data;
  },

  deleteSubject: async (subjectId) => {
    const { data } = await api.delete(`/api/v1/subjects/${subjectId}`);
    return data;
  },


  getEvaluationStructure: async (subjectId) => {
    const { data } = await api.get(`/api/v1/subjects/${subjectId}/evaluation-structure`);
    return data;
  },

  configureEvaluationStructure: async (subjectId, structure) => {
    const { data } = await api.put(`/api/v1/subjects/${subjectId}/evaluation-structure`, structure);
    return data;
  },


  getGradesByCut: async (subjectId, cutId) => {
    const { data } = await api.get(`/api/v1/subjects/${subjectId}/cuts/${cutId}/grades`);
    return data;
  },

  registerGrade: async (subjectId, cutId, gradeData) => {
    const { data } = await api.post(`/api/v1/subjects/${subjectId}/cuts/${cutId}/grades`, gradeData);
    return data;
  },

  updateGrade: async (subjectId, cutId, gradeId, gradeData) => {
    const { data } = await api.put(`/api/v1/subjects/${subjectId}/cuts/${cutId}/grades/${gradeId}`, gradeData);
    return data;
  },

  deleteGrade: async (subjectId, cutId, gradeId) => {
    const { data } = await api.delete(`/api/v1/subjects/${subjectId}/cuts/${cutId}/grades/${gradeId}`);
    return data;
  },

  getSubjectAverages: async (subjectId) => {
    const { data } = await api.get(`/api/v1/subjects/${subjectId}/averages`);
    return data;
  },

  simulateGrade: async (subjectId, payload) => {
    const { data } = await api.post(`/api/v1/subjects/${subjectId}/simulate`, payload);
    return data;
  },


  getGoals: async (semester) => {
    const { data } = await api.get('/api/v1/academic/goals', { params: semester ? { semester } : {} });
    return data;
  },

  getGoalById: async (goalId) => {
    const { data } = await api.get(`/api/v1/academic/goals/${goalId}`);
    return data;
  },

  setGoal: async (goalData) => {
    const { data } = await api.put('/api/v1/academic/goals', goalData);
    return data;
  },


  getStudyPreferences: async () => {
    const { data } = await api.get('/api/v1/students/preferences');
    return data;
  },

  saveStudyPreferences: async (preferences) => {
    const { data } = await api.put('/api/v1/students/preferences', preferences);
    return data;
  },

  getScheduleAvailability: async () => {
    const { data } = await api.get('/api/v1/students/schedule-availability');
    return data;
  },

  saveScheduleAvailability: async (availability) => {
    const { data } = await api.put('/api/v1/students/schedule-availability', availability);
    return data;
  },
};

export default academicService;