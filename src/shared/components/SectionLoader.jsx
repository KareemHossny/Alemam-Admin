import React from 'react';

const SectionLoader = ({ label = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center py-8 sm:py-12">
      <div className="flex flex-col items-center gap-3 sm:gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent sm:h-12 sm:w-12" />
        <p className="text-sm text-gray-600 sm:text-base">{label}</p>
      </div>
    </div>
  );
};

export default SectionLoader;
