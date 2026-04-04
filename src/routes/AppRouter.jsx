import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import UnifiedLoginPage from '../modules/auth/pages/UnifiedLoginPage';
import AdminModule from '../modules/admin/AdminModule';
import EngineerModule from '../modules/engineer/EngineerModule';
import SupervisorModule from '../modules/supervisor/SupervisorModule';
import GuestRoute from './GuestRoute';
import ProtectedRoute from './ProtectedRoute';
import RoleHomeRedirect from './RoleHomeRedirect';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleHomeRedirect />} />
        <Route
          path="/login"
          element={(
            <GuestRoute>
              <AuthLayout>
                <UnifiedLoginPage />
              </AuthLayout>
            </GuestRoute>
          )}
        />
        <Route
          path="/admin/*"
          element={(
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminModule />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/engineer/*"
          element={(
            <ProtectedRoute allowedRoles={['engineer']}>
              <EngineerModule />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/supervisor/*"
          element={(
            <ProtectedRoute allowedRoles={['supervisor']}>
              <SupervisorModule />
            </ProtectedRoute>
          )}
        />
        <Route path="*" element={<RoleHomeRedirect />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
