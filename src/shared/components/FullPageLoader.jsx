import React from 'react';

const FullPageLoader = ({ label = 'Loading workspace...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-white px-6">
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-slate-200 bg-white/90 px-8 py-10 shadow-xl backdrop-blur">
        <div className="h-14 w-14 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
        <p className="text-center text-sm font-semibold tracking-wide text-slate-600">{label}</p>
      </div>
    </div>
  );
};

export default FullPageLoader;
