import React from 'react';
import Dashboard from './components/Dashboard';
import { useAuth } from '../../core/auth/useAuth';

const AdminModule = () => {
  const { clearSession } = useAuth();

  return <Dashboard onLogout={clearSession} />;
};

export default AdminModule;
