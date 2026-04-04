import React from 'react';
import { AuthProvider } from './core/auth/AuthContext';
import AppRouter from './routes/AppRouter';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
