export const ROLE_CONFIG = {
  admin: {
    key: 'admin',
    label: 'Admin',
    routeBase: '/admin',
    apiBase: '/admin',
    headline: 'Administration Hub',
    description: 'Manage users, projects, assignments, and platform-wide reporting.',
    image: '/photo_2025-09-15_03-57-09.jpg',
    accentClassName: 'from-blue-600 via-indigo-600 to-slate-900',
  },
  engineer: {
    key: 'engineer',
    label: 'Engineer',
    routeBase: '/engineer',
    apiBase: '/engineer',
    headline: 'Engineering Workspace',
    description: 'Create daily and monthly task logs and track delivery progress.',
    image: '/photo_2025-09-15_04-00-20.jpg',
    accentClassName: 'from-sky-600 via-blue-600 to-slate-900',
  },
  supervisor: {
    key: 'supervisor',
    label: 'Supervisor',
    routeBase: '/supervisor',
    apiBase: '/supervisor',
    headline: 'Supervisor Console',
    description: 'Review engineer work, approve tasks, and monitor execution quality.',
    image: '/photo_2025-09-15_04-00-21.jpg',
    accentClassName: 'from-emerald-600 via-green-600 to-slate-900',
  },
};

export const ROLE_ORDER = ['admin', 'engineer', 'supervisor'];

export const isValidRole = (role) => ROLE_ORDER.includes(role);

export const getRoleConfig = (role) => ROLE_CONFIG[role] || null;

export const getRoleHomePath = (role) => getRoleConfig(role)?.routeBase || '/login';
