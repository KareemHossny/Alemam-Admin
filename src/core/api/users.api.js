import apiClient from './apiClient';
import { ensureArray, ensureNullableObject } from './apiHelpers';

export const createUser = async (userData) => ensureNullableObject(
  await apiClient.post('/admin/users', userData)
);

export const getUsers = async () => ensureArray(await apiClient.get('/admin/users'));

export const deleteUser = async (userId) => await apiClient.delete(`/admin/users/${userId}`);
