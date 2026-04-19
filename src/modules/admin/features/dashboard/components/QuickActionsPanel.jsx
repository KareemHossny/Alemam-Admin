import React from 'react';
import { Link } from 'react-router-dom';

const QuickActionsPanel = ({ items }) => {
  return (
    <section className="rounded-2xl border border-gray-200/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm lg:rounded-3xl lg:p-8">
      <h2 className="mb-4 text-xl font-bold text-gray-800 sm:mb-6 sm:text-2xl">Quick Actions</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className="group flex items-center gap-3 rounded-xl border border-blue-200/50 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 transition-all duration-300 hover:border-blue-300 hover:shadow-lg lg:rounded-2xl"
            >
              <Icon className="h-5 w-5 text-blue-600 transition-transform duration-300 group-hover:scale-110 sm:h-6 sm:w-6" />
              <span className="text-sm font-semibold text-gray-800 sm:text-base">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default QuickActionsPanel;
