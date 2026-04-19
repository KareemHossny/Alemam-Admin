import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  FiLogOut,
  FiMenu,
  FiUser,
  FiX,
} from 'react-icons/fi';
import { useAuth } from '../../../core/auth/useAuth';
import { adminAPI } from '../utils/api';
import { ADMIN_NAV_ITEMS, getAdminPageTitle } from '../constants/navigation';
import StatusBanner from '../../../shared/components/StatusBanner';
import getErrorMessage from '../../../shared/utils/getErrorMessage';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearSession } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutError, setLogoutError] = useState('');

  const handleLogout = async () => {
    try {
      setLogoutError('');
      await adminAPI.logout();
      clearSession();
      navigate('/login');
    } catch (error) {
      setLogoutError(getErrorMessage(error, 'Unable to log out right now. Please try again.'));
    }
  };

  const closeSidebar = () => setSidebarOpen(false);
  const pageTitle = getAdminPageTitle(location.pathname);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-200/60 bg-white/95 shadow-2xl backdrop-blur-2xl transition-transform duration-300 ease-in-out lg:static lg:w-80 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div
            className="cursor-pointer border-b border-gray-200/60 p-4 transition-colors hover:bg-gray-50 lg:p-7"
            onClick={() => {
              navigate('/admin');
              closeSidebar();
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl lg:h-14 lg:w-14 lg:rounded-2xl">
                  <FiUser className="h-4 w-4 lg:h-6 lg:w-6" />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-lg font-extrabold leading-tight text-gray-800 lg:text-2xl">Admin Dashboard</h1>
                  <p className="mt-1 text-xs font-medium text-gray-500 lg:text-sm">Management Panel</p>
                </div>
              </div>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  closeSidebar();
                }}
                className="rounded-xl p-2 transition-colors hover:bg-gray-100 lg:hidden"
              >
                <FiX className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          <nav className="flex-1 space-y-2 p-4 lg:space-y-3 lg:p-7">
            {ADMIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                  className={`group flex items-center gap-3 rounded-xl p-3 font-medium transition-all duration-300 lg:gap-4 lg:rounded-2xl lg:p-4 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/25'
                      : 'text-gray-700 hover:border hover:border-blue-200/50 hover:bg-blue-50 hover:shadow-lg'
                  }`}
                >
                  <Icon className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 lg:h-6 lg:w-6 ${
                    isActive ? 'text-white' : 'text-blue-600'
                  }`}
                  />
                  <div className="flex-1">
                    <div className={`text-sm font-semibold transition-colors lg:text-lg ${isActive ? 'text-white' : 'text-gray-900'}`}>
                      {item.label}
                    </div>
                    <div className={`text-xs transition-colors lg:text-sm ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-gray-200/60 p-4 lg:p-7">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-xl border border-transparent p-3 text-sm font-semibold text-red-700 transition-all duration-300 hover:border-rose-200 hover:bg-rose-50 lg:gap-3 lg:rounded-2xl lg:p-4 lg:text-base"
            >
              <FiLogOut className="h-4 w-4 transition-transform group-hover:scale-110 lg:h-5 lg:w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-gray-200/60 bg-white/90 shadow-sm backdrop-blur-2xl">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8 lg:py-4">
            <div className="flex items-center gap-3 lg:gap-4">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="rounded-xl p-2 transition-colors hover:bg-gray-100 lg:hidden"
              >
                <FiMenu className="h-5 w-5 text-gray-600 lg:h-7 lg:w-7" />
              </button>
              <div>
                <h2 className="text-xl font-extrabold text-gray-800 sm:text-2xl lg:text-3xl">{pageTitle}</h2>
                <p className="text-sm font-medium text-gray-500 lg:text-lg">Manage your system efficiently</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-transparent px-3 py-2 text-sm font-semibold text-red-700 transition-all duration-300 hover:border-rose-200 hover:bg-rose-50 lg:hidden"
            >
              <FiLogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            <StatusBanner
              message={logoutError}
              variant="error"
              className="mb-4 sm:mb-6"
            />
            <Outlet />
          </div>
        </main>
      </div>

      {sidebarOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeSidebar}
        />
      ) : null}
    </div>
  );
};

export default AdminLayout;
