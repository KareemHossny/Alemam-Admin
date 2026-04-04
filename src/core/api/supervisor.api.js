import apiClient from './client';

const buildAuthConfig = () => ({
  skipAuthRedirect: true,
  suppressAuthEvent: true,
});

export const supervisorAPI = {
  login: (credentials) => apiClient.post('/supervisor/login', credentials, buildAuthConfig()),
  logout: () => apiClient.post('/supervisor/logout', {}, buildAuthConfig()),
  getCurrentUser: () => apiClient.get('/supervisor/me', buildAuthConfig()),
  getMyProjects: () => apiClient.get('/supervisor/projects'),
  getDailyTasks: (projectId, date) => apiClient.get(`/supervisor/daily-tasks/${projectId}`, {
    params: date ? { date } : undefined,
  }),
  getMonthlyTasks: (projectId) => apiClient.get(`/supervisor/monthly-tasks/${projectId}`),
  reviewDailyTask: (taskId, reviewData) => apiClient.put(`/supervisor/daily-tasks/${taskId}/review`, reviewData),
  reviewMonthlyTask: (taskId, reviewData) => apiClient.put(`/supervisor/monthly-tasks/${taskId}/review`, reviewData),
};
