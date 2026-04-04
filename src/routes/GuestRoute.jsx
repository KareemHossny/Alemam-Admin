import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../core/auth/useAuth';
import FullPageLoader from '../shared/components/FullPageLoader';

const GuestRoute = ({ children }) => {
  const { isAuthenticated, isLoading, homePath } = useAuth();

  if (isLoading) {
    return <FullPageLoader label="Preparing sign-in..." />;
  }

  if (isAuthenticated) {
    return <Navigate to={homePath} replace />;
  }

  return children;
};

export default GuestRoute;
