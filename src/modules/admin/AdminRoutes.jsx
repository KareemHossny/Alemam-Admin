import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import AdminHomePage from './features/dashboard/pages/AdminHomePage';
import AddProjectPage from './features/projects/pages/AddProjectPage';
import ProjectsListPage from './features/projects/pages/ProjectsListPage';
import UpdateProjectPage from './features/projects/pages/UpdateProjectPage';
import TasksManagementPage from './features/tasks/pages/TasksManagementPage';
import AddUserPage from './features/users/pages/AddUserPage';
import UsersListPage from './features/users/pages/UsersListPage';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminHomePage />} />
        <Route path="add-user" element={<AddUserPage />} />
        <Route path="add-project" element={<AddProjectPage />} />
        <Route path="projects" element={<ProjectsListPage />} />
        <Route path="users" element={<UsersListPage />} />
        <Route path="update-project/:projectId" element={<UpdateProjectPage />} />
        <Route path="tasks" element={<TasksManagementPage />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
