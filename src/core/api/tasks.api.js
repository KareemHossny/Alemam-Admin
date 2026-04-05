import apiClient from './apiClient';
import {
  ensureArray,
  ensureBulkResult,
  ensureNullableObject,
  ensureObject,
  ensurePaginatedResult,
} from './apiHelpers';

const normalizeTaskFilters = (filtersOrDate) => {
  if (!filtersOrDate) {
    return undefined;
  }

  if (typeof filtersOrDate === 'string') {
    return { date: filtersOrDate };
  }

  return filtersOrDate;
};

export const getAdminTaskStats = async (filters = {}) => ensureObject(
  await apiClient.get('/admin/tasks/stats', { params: filters })
);

export const getAdminProjectStats = async (projectId, filters = {}) => ensureObject(
  await apiClient.get(`/admin/projects/${projectId}/stats`, { params: filters })
);

export const getAllDailyTasks = async (filters = {}) => ensurePaginatedResult(
  await apiClient.get('/admin/tasks/daily', { params: filters })
);

export const getAllMonthlyTasks = async (filters = {}) => ensurePaginatedResult(
  await apiClient.get('/admin/tasks/monthly', { params: filters })
);

export const getAdminProjectTasks = async (projectId) => ensureObject(
  await apiClient.get(`/admin/tasks/project/${projectId}`)
);

export const getEngineerDashboardStats = async () => ensureObject(
  await apiClient.get('/engineer/dashboard/stats')
);

export const getEngineerDailyTasks = async (projectId, filters) => ensurePaginatedResult(
  await apiClient.get(`/engineer/daily-tasks/${projectId}`, {
    params: normalizeTaskFilters(filters),
  })
);

export const createDailyTask = async (taskData) => ensureNullableObject(
  await apiClient.post('/engineer/daily-tasks', taskData)
);

export const createDailyTasksBulk = async (tasks) => ensureBulkResult(
  await apiClient.post('/engineer/daily-tasks/bulk', tasks)
);

export const deleteDailyTask = async (taskId) => await apiClient.delete(`/engineer/daily-tasks/${taskId}`);

export const getEngineerMonthlyTasks = async (projectId, filters) => ensurePaginatedResult(
  await apiClient.get(`/engineer/monthly-tasks/${projectId}`, {
    params: normalizeTaskFilters(filters),
  })
);

export const createMonthlyTask = async (taskData) => ensureNullableObject(
  await apiClient.post('/engineer/monthly-tasks', taskData)
);

export const createMonthlyTasksBulk = async (tasks) => ensureBulkResult(
  await apiClient.post('/engineer/monthly-tasks/bulk', tasks)
);

export const deleteMonthlyTask = async (taskId) => await apiClient.delete(`/engineer/monthly-tasks/${taskId}`);

export const getSupervisorDashboardStats = async () => ensureObject(
  await apiClient.get('/supervisor/dashboard/stats')
);

export const getSupervisorProjectStats = async () => ensureArray(
  await apiClient.get('/supervisor/projects/stats')
);

export const getSupervisorDailyTasks = async (projectId, filters) => ensurePaginatedResult(
  await apiClient.get(`/supervisor/daily-tasks/${projectId}`, {
    params: normalizeTaskFilters(filters),
  })
);

export const getSupervisorMonthlyTasks = async (projectId, filters) => ensurePaginatedResult(
  await apiClient.get(`/supervisor/monthly-tasks/${projectId}`, {
    params: normalizeTaskFilters(filters),
  })
);

export const reviewDailyTask = async (taskId, reviewData) => ensureNullableObject(
  await apiClient.put(`/supervisor/daily-tasks/${taskId}/review`, reviewData)
);

export const reviewMonthlyTask = async (taskId, reviewData) => ensureNullableObject(
  await apiClient.put(`/supervisor/monthly-tasks/${taskId}/review`, reviewData)
);
