import apiClient from './client';

const buildAuthConfig = () => ({
  skipAuthRedirect: true,
  suppressAuthEvent: true,
});

export const extractProjectPayload = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  if (payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
    return payload.data;
  }

  if (payload.project && typeof payload.project === 'object') {
    return payload.project;
  }

  if (payload._id) {
    return payload;
  }

  return null;
};

export const adminAPI = {
  login: (credentials) => apiClient.post('/admin/login', credentials, buildAuthConfig()),
  logout: () => apiClient.post('/admin/logout', {}, buildAuthConfig()),
  getCurrentUser: () => apiClient.get('/admin/me', buildAuthConfig()),
  createUser: (userData) => apiClient.post('/admin/users', userData),
  getUsers: () => apiClient.get('/admin/users'),
  deleteUser: (userId) => apiClient.delete(`/admin/users/${userId}`),
  createProject: (projectData) => apiClient.post('/admin/projects', projectData),
  getProjects: () => apiClient.get('/admin/projects'),
  getProjectById: (projectId) => apiClient.get(`/admin/projects/${projectId}`),
  updateProject: (projectId, projectData) => apiClient.put(`/admin/projects/${projectId}`, projectData),
  deleteProject: (projectId) => apiClient.delete(`/admin/projects/${projectId}`),
  getAllDailyTasks: () => apiClient.get('/admin/tasks/daily'),
  getAllMonthlyTasks: () => apiClient.get('/admin/tasks/monthly'),
  getProjectTasks: (projectId) => apiClient.get(`/admin/tasks/project/${projectId}`),
};
