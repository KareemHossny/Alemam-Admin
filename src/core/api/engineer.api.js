import { authAPI } from './auth.api';
import { getEngineerProjects } from './projects.api';
import {
  createDailyTask,
  createDailyTasksBulk,
  createMonthlyTask,
  createMonthlyTasksBulk,
  deleteDailyTask,
  deleteMonthlyTask,
  getEngineerDailyTasks,
  getEngineerDashboardStats,
  getEngineerMonthlyTasks,
} from './tasks.api';

export const engineerAPI = {
  login: (credentials) => authAPI.login('engineer', credentials),
  logout: () => authAPI.logout('engineer'),
  getCurrentUser: () => authAPI.getCurrentUser('engineer'),
  getMyProjects: getEngineerProjects,
  getDashboardStats: getEngineerDashboardStats,
  getDailyTasks: getEngineerDailyTasks,
  addDailyTask: createDailyTask,
  addDailyTasksBulk: createDailyTasksBulk,
  deleteDailyTask,
  getMonthlyTasks: getEngineerMonthlyTasks,
  addMonthlyTask: createMonthlyTask,
  addMonthlyTasksBulk: createMonthlyTasksBulk,
  deleteMonthlyTask,
};
