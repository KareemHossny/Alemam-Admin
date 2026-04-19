import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GuestRoute from './GuestRoute';
import ProtectedRoute from './ProtectedRoute';
import FullPageLoader from '../shared/components/FullPageLoader';

const AuthLayout = lazy(() => import('../layouts/AuthLayout'));
const UnifiedLoginPage = lazy(() => import('../modules/auth/pages/UnifiedLoginPage'));
const AdminModule = lazy(() => import('../modules/admin/AdminModule'));
const EngineerModule = lazy(() => import('../modules/engineer/EngineerModule'));
const SupervisorModule = lazy(() => import('../modules/supervisor/SupervisorModule'));
const LandingPage = lazy(() => import('../modules/landing/pages/LandingPage'));
const RoleHomeRedirect = lazy(() => import('./RoleHomeRedirect'));

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<FullPageLoader label="Loading workspace..." />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/workspace" element={<RoleHomeRedirect />} />
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
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
