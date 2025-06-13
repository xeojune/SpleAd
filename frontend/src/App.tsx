import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
// import Dashboard from './pages/Dashboard';  
// import Profile from './pages/Profile';      
import SnsLinkPage from './pages/link/snsLinkPage'
import MediaPage from './pages/media/mediaPage'

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          <Route path="/link" element={
            <ProtectedRoute>
              <SnsLinkPage />
            </ProtectedRoute>
          } />
          <Route path="/media" element={
            <ProtectedRoute>
              <MediaPage />
            </ProtectedRoute>
          } />

          {/* Redirect root to dashboard if authenticated, otherwise to login */}
          <Route path="/" element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          } />

          {/* Catch all route - redirect to dashboard if authenticated, otherwise to login */}
          <Route path="*" element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
