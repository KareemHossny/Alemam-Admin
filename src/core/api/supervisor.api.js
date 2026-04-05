import apiClient from './client';

const buildAuthConfig = () => ({
  skipAuthRedirect: true,
  suppressAuthEvent: true,
});

const normalizeTaskFilters = (filtersOrDate) => {
  if (!filtersOrDate) {
    return undefined;
  }

  if (typeof filtersOrDate === 'string') {
    return { date: filtersOrDate };
  }

  return filtersOrDate;
};

export const supervisorAPI = {
  login: (credentials) => apiClient.post('/supervisor/login', credentials, buildAuthConfig()),
  logout: () => apiClient.post('/supervisor/logout', {}, buildAuthConfig()),
  getCurrentUser: () => apiClient.get('/supervisor/me', buildAuthConfig()),
  getMyProjects: () => apiClient.get('/supervisor/projects'),
  getDailyTasks: (projectId, filters) => apiClient.get(`/supervisor/daily-tasks/${projectId}`, {
    params: normalizeTaskFilters(filters),
  }),
  getMonthlyTasks: (projectId, filters) => apiClient.get(`/supervisor/monthly-tasks/${projectId}`, {
    params: normalizeTaskFilters(filters),
  }),
  reviewDailyTask: (taskId, reviewData) => apiClient.put(`/supervisor/daily-tasks/${taskId}/review`, reviewData),
  reviewMonthlyTask: (taskId, reviewData) => apiClient.put(`/supervisor/monthly-tasks/${taskId}/review`, reviewData),
};
