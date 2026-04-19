import React from 'react';
import {
  FiBarChart2,
  FiBriefcase,
  FiUserCheck,
  FiUsers,
} from 'react-icons/fi';

const STATS_CONFIG = [
  {
    key: 'totalUsers',
    label: 'Total Users',
    icon: FiUsers,
    iconClassName: 'from-blue-500 to-blue-600',
  },
  {
    key: 'totalProjects',
    label: 'Total Projects',
    icon: FiBriefcase,
    iconClassName: 'from-emerald-500 to-emerald-600',
  },
  {
    key: 'totalEngineers',
    label: 'Engineers',
    icon: FiUserCheck,
    iconClassName: 'from-amber-500 to-amber-600',
  },
  {
    key: 'totalSupervisors',
    label: 'Supervisors',
    icon: FiBarChart2,
    iconClassName: 'from-violet-500 to-violet-600',
  },
];

const StatsOverview = ({ stats, loading }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
      {STATS_CONFIG.map((item) => {
        const Icon = item.icon;

        return (
          <article
            key={item.key}
            className="rounded-2xl border border-gray-200/50 bg-white/80 p-4 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl lg:rounded-3xl lg:p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 sm:text-base">{item.label}</p>
                <p className="mt-2 text-2xl font-extrabold text-gray-800 sm:text-3xl lg:text-4xl">
                  {loading ? '...' : stats[item.key]}
                </p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r text-white shadow-lg sm:h-12 sm:w-12 lg:h-14 lg:w-14 lg:rounded-2xl ${item.iconClassName}`}>
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default StatsOverview;
