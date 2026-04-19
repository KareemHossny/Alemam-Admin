import React from 'react';
import { FiHome, FiUsers } from 'react-icons/fi';

const RECENT_ACTIVITY_ITEMS = [
  {
    icon: FiHome,
    text: 'Welcome to your dashboard',
  },
  {
    icon: FiUsers,
    text: 'Manage users and projects',
  },
];

const RecentActivityPanel = () => {
  return (
    <section className="rounded-2xl border border-gray-200/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm lg:rounded-3xl lg:p-8">
      <h2 className="mb-4 text-xl font-bold text-gray-800 sm:mb-6 sm:text-2xl">Recent Activity</h2>
      <div className="space-y-4">
        {RECENT_ACTIVITY_ITEMS.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.text} className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
              <Icon className="h-4 w-4 text-gray-500 sm:h-5 sm:w-5" />
              <p className="text-sm text-gray-600 sm:text-base">{item.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RecentActivityPanel;
