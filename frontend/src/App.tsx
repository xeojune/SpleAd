import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import GlobalStyles from './styles/GlobalStyles';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import SnsLinkPage from './pages/link/snsLinkPage';
import DashboardPage from './pages/dashboard/dashboardPage';
import MediaPage from './pages/media/mediaPage';
import HomePage from './pages/home/homePage';
import CampaignPage from './pages/campaign/campaignPage';
import DescriptionPage from './pages/description/DescriptionPage';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
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
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage>
                <HomePage />
              </DashboardPage>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/campaign" element={
            <ProtectedRoute>
              <DashboardPage>
                <CampaignPage />
              </DashboardPage>
            </ProtectedRoute>
          } />
          <Route path="/description" element={
            <ProtectedRoute>
              <DashboardPage>
                <DescriptionPage />
              </DashboardPage>
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
