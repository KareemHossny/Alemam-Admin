import apiClient, { PUBLIC_BASE_URL } from './apiClient';
import { ensureObject } from './apiHelpers';

const buildAnonymousRequestConfig = (config = {}) => ({
  ...config,
  skipAuthRedirect: true,
  suppressAuthEvent: true,
});

export const getHealthStatus = async () => ensureObject(await apiClient.get('/health', buildAnonymousRequestConfig({
  baseURL: PUBLIC_BASE_URL,
})));

export const checkServerStatus = async () => {
  try {
    const healthStatus = await getHealthStatus();
    return healthStatus.status === 'ok';
  } catch (error) {
    return false;
  }
};
