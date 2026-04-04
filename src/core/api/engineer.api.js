import apiClient from './client';

const buildAuthConfig = () => ({
  skipAuthRedirect: true,
  suppressAuthEvent: true,
});

export const engineerAPI = {
  login: (credentials) => apiClient.post('/engineer/login', credentials, buildAuthConfig()),
  logout: () => apiClient.post('/engineer/logout', {}, buildAuthConfig()),
  getCurrentUser: () => apiClient.get('/engineer/me', buildAuthConfig()),
  getMyProjects: () => apiClient.get('/engineer/projects'),
  getDailyTasks: (projectId, date) => apiClient.get(`/engineer/daily-tasks/${projectId}`, {
    params: date ? { date } : undefined,
  }),
  addDailyTask: (taskData) => apiClient.post('/engineer/daily-tasks', taskData),
  addDailyTasksBulk: (tasks) => apiClient.post('/engineer/daily-tasks/bulk', tasks),
  deleteDailyTask: (taskId) => apiClient.delete(`/engineer/daily-tasks/${taskId}`),
  getMonthlyTasks: (projectId) => apiClient.get(`/engineer/monthly-tasks/${projectId}`),
  addMonthlyTask: (taskData) => apiClient.post('/engineer/monthly-tasks', taskData),
  addMonthlyTasksBulk: (tasks) => apiClient.post('/engineer/monthly-tasks/bulk', tasks),
  deleteMonthlyTask: (taskId) => apiClient.delete(`/engineer/monthly-tasks/${taskId}`),
};
