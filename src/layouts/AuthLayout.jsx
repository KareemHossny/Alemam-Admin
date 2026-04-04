import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.25),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.25),_transparent_30%)]" />
      <div className="relative min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
