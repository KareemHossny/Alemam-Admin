import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import SectionLoader from '../../shared/components/SectionLoader';

const AdminHomePage = lazy(() => import('./features/dashboard/pages/AdminHomePage'));
const AddProjectPage = lazy(() => import('./features/projects/pages/AddProjectPage'));
const ProjectsListPage = lazy(() => import('./features/projects/pages/ProjectsListPage'));
const UpdateProjectPage = lazy(() => import('./features/projects/pages/UpdateProjectPage'));
const TasksManagementPage = lazy(() => import('./features/tasks/pages/TasksManagementPage'));
const AddUserPage = lazy(() => import('./features/users/pages/AddUserPage'));
const UsersListPage = lazy(() => import('./features/users/pages/UsersListPage'));

const withRouteSuspense = (element) => (
  <Suspense fallback={<SectionLoader label="Loading admin page..." />}>
    {element}
  </Suspense>
);

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={withRouteSuspense(<AdminHomePage />)} />
        <Route path="add-user" element={withRouteSuspense(<AddUserPage />)} />
        <Route path="add-project" element={withRouteSuspense(<AddProjectPage />)} />
        <Route path="projects" element={withRouteSuspense(<ProjectsListPage />)} />
        <Route path="users" element={withRouteSuspense(<UsersListPage />)} />
        <Route path="update-project/:projectId" element={withRouteSuspense(<UpdateProjectPage />)} />
        <Route path="tasks" element={withRouteSuspense(<TasksManagementPage />)} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
