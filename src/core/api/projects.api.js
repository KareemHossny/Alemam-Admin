import apiClient from './apiClient';
import { ensureArray, ensureNullableObject, ensureProjectPayload } from './apiHelpers';

export const createProject = async (projectData) => ensureProjectPayload(
  await apiClient.post('/admin/projects', projectData)
);

export const getAdminProjects = async () => ensureArray(await apiClient.get('/admin/projects'));

export const getEngineerProjects = async () => ensureArray(await apiClient.get('/engineer/projects'));

export const getSupervisorProjects = async () => ensureArray(await apiClient.get('/supervisor/projects'));

export const getProjectById = async (projectId) => ensureProjectPayload(
  await apiClient.get(`/admin/projects/${projectId}`)
);

export const updateProject = async (projectId, projectData) => ensureProjectPayload(
  await apiClient.put(`/admin/projects/${projectId}`, projectData)
);

export const deleteProject = async (projectId) => ensureNullableObject(
  await apiClient.delete(`/admin/projects/${projectId}`)
);
