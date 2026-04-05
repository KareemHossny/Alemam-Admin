import apiClient from './client';
import { ROLE_ORDER, getRoleConfig } from '../constants/roles';
import { ensureUserPayload } from './apiHelpers';

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
  login: async (role, credentials) => ensureUserPayload(
    await apiClient.post(buildRolePath(role, 'login'), credentials, buildAuthConfig())
  ),
  logout: async (role) => await apiClient.post(buildRolePath(role, 'logout'), {}, buildAuthConfig()),
  getCurrentUser: async (role) => ensureUserPayload(
    await apiClient.get(buildRolePath(role, 'me'), buildAuthConfig())
  ),
  async logoutAll() {
    await Promise.allSettled(ROLE_ORDER.map((role) => authAPI.logout(role)));
  },
  async resolveCurrentSession() {
    for (const role of ROLE_ORDER) {
      try {
        const session = await authAPI.getCurrentUser(role);

        if (session.user) {
          return {
            role,
            user: session.user,
          };
        }
      } catch (error) {
        if (error.status && error.status !== 401) {
          throw error;
        }
      }
    }

    return null;
  },
  async authenticate(role, credentials) {
    await authAPI.logoutAll();
    await authAPI.login(role, credentials);

    const session = await authAPI.getCurrentUser(role);

    if (!session.user) {
      throw new Error('Session was not established');
    }

    return {
      role,
      user: session.user,
    };
  },
};
