import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { adminAPI, checkServerStatus } from './utils/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [serverOnline, setServerOnline] = useState(false);

  // التحقق من حالة السيرفر والمصادقة
  useEffect(() => {
    let isMounted = true;

    const initApp = async () => {
      const isOnline = await checkServerStatus();

      if (!isMounted) {
        return;
      }

      setServerOnline(isOnline);

      if (isOnline) {
        try {
          const response = await adminAPI.getCurrentUser();
          if (isMounted && response.data?.user) {
            setIsAuthenticated(true);
          }
        } catch (error) {
          if (error.response?.status !== 401) {
            console.error('Error restoring admin session:', error);
          }
        }
      }

      if (isMounted) {
        setLoading(false);
      }
    };

    initApp();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? (
                <Login 
                  onLogin={handleLogin} 
                  serverOnline={serverOnline}
                />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } 
          />
          <Route 
            path="/dashboard/*" 
            element={
              isAuthenticated ? (
                <Dashboard onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
          />
          <Route 
            path="*" 
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
