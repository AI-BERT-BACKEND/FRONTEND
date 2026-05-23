import taskApi from './taskApi';

const taskService = {

  // Tasks CRUD
  getTasks: async (params = {}) => {
    const { data } = await taskApi.get('/tasks', { params });
    return data;
  },

  createTask: async (taskData) => {
    const { data } = await taskApi.post('/tasks', taskData);
    return data;
  },

  getTaskById: async (id) => {
    const { data } = await taskApi.get(`/tasks/${id}`);
    return data;
  },

  updateTask: async (id, taskData) => {
    const { data } = await taskApi.put(`/tasks/${id}`, taskData);
    return data;
  },

  patchTask: async (id, taskData) => {
    const { data } = await taskApi.patch(`/tasks/${id}`, taskData);
    return data;
  },

  deleteTask: async (id) => {
    const { data } = await taskApi.delete(`/tasks/${id}`);
    return data;
  },

  // Task Status & Scheduling
  updateTaskStatus: async (id, status) => {
    const { data } = await taskApi.patch(`/tasks/${id}/status`, { status });
    return data;
  },

  rescheduleTask: async (id, scheduledDate) => {
    const { data } = await taskApi.patch(`/tasks/${id}/schedule`, { scheduledDate });
    return data;
  },

  updateTaskDeadline: async (id, newDeadline) => {
    const { data } = await taskApi.patch(`/tasks/${id}/deadline`, { newDeadline });
    return data;
  },

  // Student Tasks
  getStudentTasks: async (studentId) => {
    const { data } = await taskApi.get(`/tasks/student/${studentId}`);
    return data;
  },

  organizeTasks: async (studentId) => {
    const { data } = await taskApi.post(`/tasks/student/${studentId}/organize`);
    return data;
  },

  // Summary & Prioritization
  getPrioritizedTasks: async (forceRecalculate = false) => {
    const { data } = await taskApi.get('/tasks/prioritized', { params: { forceRecalculate } });
    return data;
  },

  getDailySummary: async () => {
    const { data } = await taskApi.get('/tasks/daily-summary');
    return data;
  },

  // Calendar
  getCalendarConflicts: async (startDate, endDate) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const { data } = await taskApi.get('/tasks/calendar/conflicts', { params });
    return data;
  },
};

export default taskService;
