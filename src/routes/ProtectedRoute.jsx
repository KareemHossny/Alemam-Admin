import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../core/auth/useAuth';
import { getRoleHomePath } from '../core/constants/roles';
import FullPageLoader from '../shared/components/FullPageLoader';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, role } = useAuth();

  if (isLoading) {
    return <FullPageLoader label="Checking access..." />;
  }

  if (!isAuthenticated) {
    const next = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?next=${encodeURIComponent(next)}`} replace />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(role)) {
    return <Navigate to={getRoleHomePath(role)} replace />;
  }

  return children;
};

export default ProtectedRoute;
