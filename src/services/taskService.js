import api from './api';

const taskService = {

  // Tasks CRUD
  getTasks: async (params = {}) => {
    const { data } = await api.get('/api/tasks', { params });
    return data;
  },

  createTask: async (taskData) => {
    const { data } = await api.post('/api/tasks', taskData);
    return data;
  },

  getTaskById: async (id) => {
    const { data } = await api.get(`/api/tasks/${id}`);
    return data;
  },

  updateTask: async (id, taskData) => {
    const { data } = await api.put(`/api/tasks/${id}`, taskData);
    return data;
  },

  patchTask: async (id, taskData) => {
    const { data } = await api.patch(`/api/tasks/${id}`, taskData);
    return data;
  },

  deleteTask: async (id) => {
    const { data } = await api.delete(`/api/tasks/${id}`);
    return data;
  },

  // Task Status & Scheduling
  updateTaskStatus: async (id, status) => {
    const { data } = await api.patch(`/api/tasks/${id}/status`, { status });
    return data;
  },

  rescheduleTask: async (id, scheduledDate) => {
    const { data } = await api.patch(`/api/tasks/${id}/schedule`, { scheduledDate });
    return data;
  },

  updateTaskDeadline: async (id, newDeadline) => {
    const { data } = await api.patch(`/api/tasks/${id}/deadline`, { newDeadline });
    return data;
  },

  // Student Tasks
  getStudentTasks: async (studentId) => {
    const { data } = await api.get(`/api/tasks/student/${studentId}`);
    return data;
  },

  organizeTasks: async (studentId) => {
    const { data } = await api.post(`/api/tasks/student/${studentId}/organize`);
    return data;
  },

  // Summary & Prioritization
  getPrioritizedTasks: async (forceRecalculate = false) => {
    const { data } = await api.get('/api/tasks/prioritized', { params: { forceRecalculate } });
    return data;
  },

  getDailySummary: async () => {
    const { data } = await api.get('/api/tasks/daily-summary');
    return data;
  },

  // Calendar
  getCalendarConflicts: async (startDate, endDate) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const { data } = await api.get('/api/tasks/calendar/conflicts', { params });
    return data;
  },
};

export default taskService;
