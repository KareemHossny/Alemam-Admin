import { authAPI } from './auth.api';
import { getSupervisorProjects } from './projects.api';
import {
  getSupervisorDailyTasks,
  getSupervisorDashboardStats,
  getSupervisorMonthlyTasks,
  getSupervisorProjectStats,
  reviewDailyTask,
  reviewMonthlyTask,
} from './tasks.api';

export const supervisorAPI = {
  login: (credentials) => authAPI.login('supervisor', credentials),
  logout: () => authAPI.logout('supervisor'),
  getCurrentUser: () => authAPI.getCurrentUser('supervisor'),
  getMyProjects: getSupervisorProjects,
  getDashboardStats: getSupervisorDashboardStats,
  getProjectStats: getSupervisorProjectStats,
  getDailyTasks: getSupervisorDailyTasks,
  getMonthlyTasks: getSupervisorMonthlyTasks,
  reviewDailyTask,
  reviewMonthlyTask,
};
