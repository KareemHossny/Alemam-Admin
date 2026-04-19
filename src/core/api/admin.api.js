import { authAPI } from './auth.api';
import { ensureObject, ensureProjectPayload } from './apiHelpers';
import apiClient from './apiClient';
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

const getAdminDashboardStats = async () => ensureObject(
  await apiClient.get('/admin/stats')
);

export const adminAPI = {
  login: (credentials) => authAPI.login('admin', credentials),
  logout: () => authAPI.logout('admin'),
  getCurrentUser: () => authAPI.getCurrentUser('admin'),
  getDashboardStats: getAdminDashboardStats,
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
