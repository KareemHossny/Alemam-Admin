import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiMenu,
  FiX,
  FiLogOut,
  FiUsers,
  FiBriefcase,
  FiUserPlus,
  FiPlus,
  FiBarChart2,
  FiUserCheck,
  FiUser,
  FiEye,
  FiHome
} from 'react-icons/fi';
import AddUser from './AddUser';
import AddProject from './AddProject';
import ProjectsList from './ProjectsList';
import UsersList from './UsersList';
import UpdateProject from './UpdateProject';
import TasksManagement from './TasksManagement';
import { adminAPI } from '../utils/api';

const Dashboard = ({ onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalEngineers: 0,
    totalSupervisors: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersResponse, projectsResponse] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getProjects()
      ]);
      
      const users = usersResponse.data;
      const projects = projectsResponse.data;
      
      const engineers = users.filter(user => user.role === 'engineer');
      const supervisors = users.filter(user => user.role === 'supervisor');

      setStats({
        totalUsers: users.length,
        totalProjects: projects.length,
        totalEngineers: engineers.length,
        totalSupervisors: supervisors.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await adminAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      onLogout();
      navigate('/login');
    }
  };

  const menuItems = [
    {
      path: '/dashboard/add-user',
      label: 'Add User',
      icon: FiUserPlus,
      description: 'Create new users'
    },
    {
      path: '/dashboard/add-project',
      label: 'Add Project',
      icon: FiPlus,
      description: 'Create new projects'
    },
    {
      path: '/dashboard/projects',
      label: 'Projects List',
      icon: FiBriefcase,
      description: 'View all projects'
    },
    {
      path: '/dashboard/users',
      label: 'Users List',
      icon: FiUsers,
      description: 'Manage users'
    },
    {
      path: '/dashboard/tasks',
      label: 'Tasks Management',
      icon: FiEye,
      description: 'View all tasks'
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white/95 backdrop-blur-2xl shadow-2xl border-r border-gray-200/60 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header - Clickable to go to Dashboard */}
          <div 
            className="p-7 border-b border-gray-200/60 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => navigate('/dashboard')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-xl">
                  <FiUser className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-2xl font-extrabold text-gray-800 leading-tight">Admin Dashboard</h1>
                  <p className="text-sm text-gray-500 mt-1 font-medium">Management Panel</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <FiX className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-7 space-y-3">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group font-medium ${
                    active
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/25'
                      : 'text-gray-700 hover:bg-blue-50 hover:shadow-lg hover:border hover:border-blue-200/50'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <IconComponent className={`w-6 h-6 transition-transform duration-300 group-hover:scale-110 ${
                    active ? 'text-white' : 'text-blue-600'
                  }`} />
                  <div className="flex-1">
                    <div className={`font-semibold text-lg transition-colors ${
                      active ? 'text-white' : 'text-gray-900'
                    }`}>
                      {item.label}
                    </div>
                    <div className={`text-sm transition-colors ${
                      active ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button في الـ Sidebar (اختياري) */}
          <div className="p-7 border-t border-gray-200/60">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full p-4 text-red-700 hover:bg-rose-50 rounded-2xl transition-all duration-300 group border border-transparent hover:border-rose-200 font-semibold"
            >
              <FiLogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white/90 backdrop-blur-2xl border-b border-gray-200/60 shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-3 hover:bg-gray-100 rounded-2xl transition-colors"
              >
                <FiMenu className="w-7 h-7 text-gray-600" />
              </button>
              <div className="lg:block">
                <h1 className="text-3xl font-extrabold text-gray-800">
                  {location.pathname === '/dashboard' ? 'Dashboard' :
                    location.pathname.includes('add-user') ? 'Add User' :
                    location.pathname.includes('add-project') ? 'Add Project' :
                    location.pathname.includes('projects') ? 'Projects' : 
                    location.pathname.includes('users') ? 'Users' :
                    location.pathname.includes('tasks') ? 'Tasks' :
                    location.pathname.includes('update-project') ? 'Update Project' : 'Dashboard'}
                </h1>
                <p className="text-gray-500 text-lg font-medium">
                  Manage your system efficiently
                </p>
              </div>
            </div>
            
            {/* Logout Button في الـ Header */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-3 text-red-700 hover:bg-rose-50 hover:text-rose-700 rounded-2xl transition-all duration-300 group border border-red-200 hover:border-rose-200 font-semibold shadow-sm"
            >
              <FiLogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-8 py-8 bg-transparent">
          <Routes>
            <Route path="add-user" element={<AddUser />} />
            <Route path="add-project" element={<AddProject />} />
            <Route path="projects" element={<ProjectsList />} />
            <Route path="users" element={<UsersList />} />
            <Route path="update-project/:projectId" element={<UpdateProject />} />
            <Route path="tasks" element={<TasksManagement />} />
            <Route path="/" element={<WelcomeSection stats={stats} loading={loading} />} />
          </Routes>
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

// Welcome Section for Admin - مشابه لـ Engineer Dashboard
const WelcomeSection = ({ stats, loading }) => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
          Welcome to{' '}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Admin Dashboard
          </span>
        </h1>
        <p className="text-2xl text-gray-600 max-w-3xl mx-auto font-medium leading-relaxed">
          Effortlessly manage your users, projects, and system from one powerful platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-16">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 p-8 text-center hover:scale-105 transition-transform duration-300">
          <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FiUsers className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-4xl font-extrabold text-gray-800 mb-3">
            {loading ? '...' : stats.totalUsers}
          </h3>
          <p className="text-xl text-gray-600 font-semibold">Total Users</p>
          <p className="text-sm text-gray-500 mt-2">All system users</p>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 p-8 text-center hover:scale-105 transition-transform duration-300">
          <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FiBriefcase className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-4xl font-extrabold text-gray-800 mb-3">
            {loading ? '...' : stats.totalProjects}
          </h3>
          <p className="text-xl text-gray-600 font-semibold">Total Projects</p>
          <p className="text-sm text-gray-500 mt-2">Active projects</p>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 p-8 text-center hover:scale-105 transition-transform duration-300">
          <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FiUserCheck className="w-10 h-10 text-orange-600" />
          </div>
          <h3 className="text-4xl font-extrabold text-gray-800 mb-3">
            {loading ? '...' : stats.totalEngineers}
          </h3>
          <p className="text-xl text-gray-600 font-semibold">Engineers</p>
          <p className="text-sm text-gray-500 mt-2">Technical team</p>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 p-8 text-center hover:scale-105 transition-transform duration-300">
          <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FiUser className="w-10 h-10 text-purple-600" />
          </div>
          <h3 className="text-4xl font-extrabold text-gray-800 mb-3">
            {loading ? '...' : stats.totalSupervisors}
          </h3>
          <p className="text-xl text-gray-600 font-semibold">Supervisors</p>
          <p className="text-sm text-gray-500 mt-2">Management team</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 p-10">
          <h3 className="text-3xl font-extrabold text-gray-800 mb-8 flex items-center gap-4">
            <FiBarChart2 className="w-8 h-8 text-blue-600" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/dashboard/add-user"
              className="flex items-center gap-4 p-6 rounded-2xl border-2 border-gray-200/60 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 group bg-white/60 hover:bg-blue-50 font-semibold text-gray-800 hover:text-blue-700"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <FiUserPlus className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold transition-colors">Add New User</div>
                <div className="text-gray-600 text-lg mt-1">Create engineer or supervisor account</div>
              </div>
            </Link>
            
            <Link
              to="/dashboard/add-project"
              className="flex items-center gap-4 p-6 rounded-2xl border-2 border-gray-200/60 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 group bg-white/60 hover:bg-blue-50 font-semibold text-gray-800 hover:text-blue-700"
            >
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <FiPlus className="w-8 h-8 text-green-600 group-hover:text-green-700 transition-colors" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold transition-colors">Create Project</div>
                <div className="text-gray-600 text-lg mt-1">Setup new project with teams</div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Management Overview */}
      <div className="max-w-5xl mx-auto mt-16">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 p-10">
          <h3 className="text-3xl font-extrabold text-gray-800 mb-8 flex items-center gap-4">
            <FiHome className="w-8 h-8 text-blue-600" />
            Management Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* User Management */}
            <div className="text-center p-6 rounded-2xl border-2 border-blue-200 bg-blue-50/50">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiUsers className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">User Management</h4>
              <p className="text-gray-600 mb-4">Add, edit, and organize users</p>
              <Link
                to="/dashboard/users"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-semibold"
              >
                <FiUsers className="w-4 h-4" />
                Manage Users
              </Link>
            </div>

            {/* Project Tracking */}
            <div className="text-center p-6 rounded-2xl border-2 border-green-200 bg-green-50/50">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiBriefcase className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">Project Tracking</h4>
              <p className="text-gray-600 mb-4">Monitor and update projects</p>
              <Link
                to="/dashboard/projects"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors font-semibold"
              >
                <FiBriefcase className="w-4 h-4" />
                View Projects
              </Link>
            </div>

            {/* System Overview */}
            <div className="text-center p-6 rounded-2xl border-2 border-purple-200 bg-purple-50/50">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiBarChart2 className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">System Overview</h4>
              <p className="text-gray-600 mb-4">Stay on top of system status</p>
              <div className="text-sm text-gray-500 space-y-1">
                <div>👥 {stats.totalUsers} Total Users</div>
                <div>📁 {stats.totalProjects} Active Projects</div>
                <div>⚡ System Running</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;