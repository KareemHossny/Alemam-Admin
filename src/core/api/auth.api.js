import apiClient from './client';
import { ROLE_ORDER, getRoleConfig } from '../constants/roles';

const buildAuthConfig = () => ({
  skipAuthRedirect: true,
  suppressAuthEvent: true,
});

const buildRolePath = (role, suffix) => {
  const roleConfig = getRoleConfig(role);

  if (!roleConfig) {
    throw new Error(`Unsupported role: ${role}`);
  }

  return `${roleConfig.apiBase}/${suffix}`;
};

export const authAPI = {
  login: (role, credentials) => apiClient.post(buildRolePath(role, 'login'), credentials, buildAuthConfig()),
  logout: (role) => apiClient.post(buildRolePath(role, 'logout'), {}, buildAuthConfig()),
  getCurrentUser: (role) => apiClient.get(buildRolePath(role, 'me'), buildAuthConfig()),
  async logoutAll() {
    await Promise.allSettled(ROLE_ORDER.map((role) => authAPI.logout(role)));
  },
  async resolveCurrentSession() {
    for (const role of ROLE_ORDER) {
      try {
        const response = await authAPI.getCurrentUser(role);

        if (response.data?.user) {
          return {
            role,
            user: response.data.user,
          };
        }
      } catch (error) {
        if (error.response?.status && error.response.status !== 401) {
          throw error;
        }
      }
    }

    return null;
  },
  async authenticate(role, credentials) {
    await authAPI.logoutAll();
    await authAPI.login(role, credentials);

    const response = await authAPI.getCurrentUser(role);

    if (!response.data?.user) {
      throw new Error('Session was not established');
    }

    return {
      role,
      user: response.data.user,
    };
  },
};
