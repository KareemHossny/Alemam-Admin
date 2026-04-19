import React from 'react';

const SurfaceCard = ({ children, className = '' }) => {
  return (
    <div className={`rounded-2xl border border-gray-200/50 bg-white/80 p-4 shadow-lg backdrop-blur-sm sm:rounded-3xl sm:p-6 lg:p-8 ${className}`.trim()}>
      {children}
    </div>
  );
};

export default SurfaceCard;
