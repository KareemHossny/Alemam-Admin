import {
  FiBriefcase,
  FiEye,
  FiPlus,
  FiUserPlus,
  FiUsers,
} from 'react-icons/fi';

export const ADMIN_NAV_ITEMS = [
  {
    path: '/admin/add-user',
    label: 'Add User',
    icon: FiUserPlus,
    description: 'Create new users',
  },
  {
    path: '/admin/add-project',
    label: 'Add Project',
    icon: FiPlus,
    description: 'Create new projects',
  },
  {
    path: '/admin/projects',
    label: 'Projects',
    icon: FiBriefcase,
    description: 'View all projects',
  },
  {
    path: '/admin/users',
    label: 'Users',
    icon: FiUsers,
    description: 'Manage users',
  },
  {
    path: '/admin/tasks',
    label: 'Tasks',
    icon: FiEye,
    description: 'View all tasks',
  },
];

export const getAdminPageTitle = (pathname = '') => {
  if (pathname === '/admin') {
    return 'Dashboard';
  }

  if (pathname.includes('add-user')) {
    return 'Add User';
  }

  if (pathname.includes('add-project')) {
    return 'Add Project';
  }

  if (pathname.includes('projects')) {
    return 'Projects';
  }

  if (pathname.includes('users')) {
    return 'Users';
  }

  if (pathname.includes('tasks')) {
    return 'Tasks';
  }

  if (pathname.includes('update-project')) {
    return 'Update Project';
  }

  return 'Dashboard';
};
