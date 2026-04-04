import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../core/auth/useAuth';
import FullPageLoader from '../shared/components/FullPageLoader';

const RoleHomeRedirect = () => {
  const { isAuthenticated, isLoading, homePath } = useAuth();

  if (isLoading) {
    return <FullPageLoader label="Loading workspace..." />;
  }

  return <Navigate to={isAuthenticated ? homePath : '/login'} replace />;
};

export default RoleHomeRedirect;
