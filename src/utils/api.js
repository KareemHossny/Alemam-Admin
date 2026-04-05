import axios from 'axios';

// إنشاء instance مخصص لـ axios
const api = axios.create({
  baseURL: 'https://alemam-backend.vercel.app/api', 
  timeout: 15000,
  withCredentials: true,
});

const shouldRedirectToLogin = (error) => {
  if (error.response?.status !== 401) {
    return false;
  }

  if (error.config?.skipAuthRedirect) {
    return false;
  }

  if (error.config?.url?.includes('/login')) {
    return false;
  }

  return window.location.pathname !== '/login';
};

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (shouldRedirectToLogin(error)) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

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

// وظائف الـ Admin
export const adminAPI = {
  login: (credentials) => api.post('/admin/login', credentials, { skipAuthRedirect: true }),
  logout: () => api.post('/admin/logout'),
  getCurrentUser: () => api.get('/admin/me', { skipAuthRedirect: true }),
  
  // Users
  createUser: (userData) => api.post('/admin/users', userData),
  getUsers: () => api.get('/admin/users'),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  
  // Projects
  createProject: (projectData) => api.post('/admin/projects', projectData),
  getProjects: () => api.get('/admin/projects'),
  getProjectById: (projectId) => api.get(`/admin/projects/${projectId}`), // الدالة الجديدة
  updateProject: (projectId, projectData) => api.put(`/admin/projects/${projectId}`, projectData),
  deleteProject: (projectId) => api.delete(`/admin/projects/${projectId}`),
  
  // Tasks Management
  getAllDailyTasks: (filters = {}) => api.get('/admin/tasks/daily', { params: filters }),
  getAllMonthlyTasks: (filters = {}) => api.get('/admin/tasks/monthly', { params: filters }),
  getProjectTasks: (projectId) => api.get(`/admin/tasks/project/${projectId}`),
};

// وظيفة للتحقق من حالة السيرفر
export const checkServerStatus = async () => {
  try {
    const response = await axios.get('https://alemam-backend.vercel.app/health', { 
      timeout: 3000 
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

export default api;
