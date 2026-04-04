import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authAPI } from '../api/auth.api';
import { AUTH_REQUIRED_EVENT } from '../api/client';
import { getRoleHomePath } from '../constants/roles';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    role: null,
    isLoading: true,
    error: null,
  });

  const clearSession = useCallback(() => {
    setAuthState({
      user: null,
      role: null,
      isLoading: false,
      error: null,
    });
  }, []);

  const restoreSession = useCallback(async () => {
    setAuthState((previousState) => ({
      ...previousState,
      isLoading: true,
      error: null,
    }));

    try {
      const session = await authAPI.resolveCurrentSession();

      if (session) {
        setAuthState({
          user: session.user,
          role: session.role,
          isLoading: false,
          error: null,
        });
        return session;
      }

      clearSession();
      return null;
    } catch (error) {
      console.error('Unable to restore session:', error);
      setAuthState({
        user: null,
        role: null,
        isLoading: false,
        error: 'Unable to restore the current session.',
      });
      return null;
    }
  }, [clearSession]);

  const login = useCallback(async (role, credentials) => {
    setAuthState((previousState) => ({
      ...previousState,
      isLoading: true,
      error: null,
    }));

    try {
      const session = await authAPI.authenticate(role, credentials);

      setAuthState({
        user: session.user,
        role: session.role,
        isLoading: false,
        error: null,
      });

      return session;
    } catch (error) {
      const nextError = error.response?.data?.message || error.message || 'Login failed. Please try again.';

      setAuthState((previousState) => ({
        ...previousState,
        isLoading: false,
        error: nextError,
      }));

      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (authState.role) {
        await authAPI.logout(authState.role);
      } else {
        await authAPI.logoutAll();
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      clearSession();
    }
  }, [authState.role, clearSession]);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    const handleAuthRequired = () => {
      clearSession();
    };

    window.addEventListener(AUTH_REQUIRED_EVENT, handleAuthRequired);

    return () => {
      window.removeEventListener(AUTH_REQUIRED_EVENT, handleAuthRequired);
    };
  }, [clearSession]);

  const contextValue = useMemo(() => ({
    ...authState,
    isAuthenticated: Boolean(authState.user && authState.role),
    homePath: getRoleHomePath(authState.role),
    login,
    logout,
    clearSession,
    restoreSession,
  }), [authState, clearSession, login, logout, restoreSession]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
