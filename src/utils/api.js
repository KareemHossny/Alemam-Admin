import axios from 'axios';

// إنشاء instance مخصص لـ axios
const api = axios.create({
  baseURL: 'https://alemam-backend.vercel.app/api', 
  timeout: 15000,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// وظائف الـ Admin
export const adminAPI = {
  login: (credentials) => api.post('/admin/login', credentials),
  logout: () => api.post('/admin/logout'),
  
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
  getAllDailyTasks: () => api.get('/admin/tasks/daily'),
  getAllMonthlyTasks: () => api.get('/admin/tasks/monthly'),
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