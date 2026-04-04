import React from 'react';
import SupervisorDashboard from './components/SupervisorDashboard';
import { useAuth } from '../../core/auth/useAuth';

const SupervisorModule = () => {
  const { clearSession, user } = useAuth();

  return <SupervisorDashboard onLogout={clearSession} supervisorInfo={user} />;
};

export default SupervisorModule;
