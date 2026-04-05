import { authAPI } from './auth.api';
import { ensureProjectPayload } from './apiHelpers';
import {
  createProject,
  deleteProject,
  getAdminProjects,
  getProjectById,
  updateProject,
} from './projects.api';
import {
  getAdminProjectStats,
  getAdminProjectTasks,
  getAdminTaskStats,
  getAllDailyTasks,
  getAllMonthlyTasks,
} from './tasks.api';
import { createUser, deleteUser, getUsers } from './users.api';

export const extractProjectPayload = (payload) => ensureProjectPayload(payload);

export const adminAPI = {
  login: (credentials) => authAPI.login('admin', credentials),
  logout: () => authAPI.logout('admin'),
  getCurrentUser: () => authAPI.getCurrentUser('admin'),
  createUser,
  getUsers,
  deleteUser,
  createProject,
  getProjects: getAdminProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getTaskStats: getAdminTaskStats,
  getProjectStats: getAdminProjectStats,
  getAllDailyTasks,
  getAllMonthlyTasks,
  getProjectTasks: getAdminProjectTasks,
};
