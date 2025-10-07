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
        className={`fixed inset-y-0 left-0 z-50 w-64 lg:w-80 bg-white/95 backdrop-blur-2xl shadow-2xl border-r border-gray-200/60 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header - Clickable to go to Dashboard */}
          <div 
            className="p-4 lg:p-7 border-b border-gray-200/60 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => navigate('/dashboard')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl lg:rounded-2xl flex items-center justify-center text-white font-bold text-sm lg:text-lg shadow-xl">
                  <FiUser className="w-4 h-4 lg:w-6 lg:h-6" />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-lg lg:text-2xl font-extrabold text-gray-800 leading-tight">Admin Dashboard</h1>
                  <p className="text-xs lg:text-sm text-gray-500 mt-1 font-medium">Management Panel</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <FiX className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 lg:p-7 space-y-2 lg:space-y-3">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 lg:gap-4 p-3 lg:p-4 rounded-xl lg:rounded-2xl transition-all duration-300 group font-medium ${
                    active
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/25'
                      : 'text-gray-700 hover:bg-blue-50 hover:shadow-lg hover:border hover:border-blue-200/50'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <IconComponent className={`w-5 h-5 lg:w-6 lg:h-6 transition-transform duration-300 group-hover:scale-110 ${
                    active ? 'text-white' : 'text-blue-600'
                  }`} />
                  <div className="flex-1">
                    <div className={`font-semibold text-sm lg:text-lg transition-colors ${
                      active ? 'text-white' : 'text-gray-900'
                    }`}>
                      {item.label}
                    </div>
                    <div className={`text-xs lg:text-sm transition-colors ${
                      active ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button في الـ Sidebar */}
          <div className="p-4 lg:p-7 border-t border-gray-200/60">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 lg:gap-3 w-full p-3 lg:p-4 text-red-700 hover:bg-rose-50 rounded-xl lg:rounded-2xl transition-all duration-300 group border border-transparent hover:border-rose-200 font-semibold text-sm lg:text-base"
            >
              <FiLogOut className="w-4 h-4 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white/90 backdrop-blur-2xl border-b border-gray-200/60 shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
            <div className="flex items-center gap-3 lg:gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <FiMenu className="w-5 h-5 lg:w-7 lg:h-7 text-gray-600" />
              </button>
              <div className="lg:block">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-800">
                  {location.pathname === '/dashboard' ? 'Dashboard' :
                    location.pathname.includes('add-user') ? 'Add User' :
                    location.pathname.includes('add-project') ? 'Add Project' :
                    location.pathname.includes('projects') ? 'Projects' : 
                    location.pathname.includes('users') ? 'Users' :
                    location.pathname.includes('tasks') ? 'Tasks' :
                    location.pathname.includes('update-project') ? 'Update Project' : 'Dashboard'}
                </h1>
                <p className="text-gray-500 text-sm lg:text-lg font-medium">
                  Manage your system efficiently
                </p>
              </div>
            </div>
            
            {/* Logout Button في الـ Header */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 text-red-700 hover:bg-rose-50 rounded-xl lg:rounded-2xl transition-all duration-300 group border border-transparent hover:border-rose-200 font-semibold text-sm lg:text-base lg:hidden"
            >
              <FiLogOut className="w-4 h-4 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Dashboard Stats */}
            {location.pathname === '/dashboard' && (
              <div className="mb-6 sm:mb-8 lg:mb-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                  {/* Total Users Card */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-lg border border-gray-200/50 p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm sm:text-base font-semibold">Total Users</p>
                        <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 mt-2">
                          {loading ? '...' : stats.totalUsers}
                        </p>
                      </div>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl lg:rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <FiUsers className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                      </div>
                    </div>
                  </div>

                  {/* Total Projects Card */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-lg border border-gray-200/50 p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm sm:text-base font-semibold">Total Projects</p>
                        <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 mt-2">
                          {loading ? '...' : stats.totalProjects}
                        </p>
                      </div>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl lg:rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <FiBriefcase className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                      </div>
                    </div>
                  </div>

                  {/* Engineers Card */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-lg border border-gray-200/50 p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm sm:text-base font-semibold">Engineers</p>
                        <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 mt-2">
                          {loading ? '...' : stats.totalEngineers}
                        </p>
                      </div>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl lg:rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <FiUserCheck className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                      </div>
                    </div>
                  </div>

                  {/* Supervisors Card */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-lg border border-gray-200/50 p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm sm:text-base font-semibold">Supervisors</p>
                        <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 mt-2">
                          {loading ? '...' : stats.totalSupervisors}
                        </p>
                      </div>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl lg:rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <FiBarChart2 className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Page Content */}
            <Routes>
              <Route path="/" element={
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                  {/* Quick Actions */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-lg border border-gray-200/50 p-6 sm:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {menuItems.slice(0, 4).map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl lg:rounded-2xl border border-blue-200/50 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group"
                          >
                            <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                            <span className="font-semibold text-gray-800 text-sm sm:text-base">{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-lg border border-gray-200/50 p-6 sm:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Recent Activity</h2>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <FiHome className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                        <p className="text-gray-600 text-sm sm:text-base">Welcome to your dashboard</p>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <FiUsers className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                        <p className="text-gray-600 text-sm sm:text-base">Manage users and projects</p>
                      </div>
                    </div>
                  </div>
                </div>
              } />
              <Route path="add-user" element={<AddUser />} />
              <Route path="add-project" element={<AddProject />} />
              <Route path="projects" element={<ProjectsList />} />
              <Route path="users" element={<UsersList />} />
              <Route path="update-project/:projectId" element={<UpdateProject />} />
              <Route path="tasks" element={<TasksManagement />} />
            </Routes>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;