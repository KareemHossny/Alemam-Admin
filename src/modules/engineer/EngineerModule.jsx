import React from 'react';
import EngineerDashboard from './components/EngineerDashboard';
import { useAuth } from '../../core/auth/useAuth';

const EngineerModule = () => {
  const { clearSession, user } = useAuth();

  return <EngineerDashboard onLogout={clearSession} engineerInfo={user} />;
};

export default EngineerModule;
