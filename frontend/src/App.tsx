import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import GlobalStyles from './styles/GlobalStyles';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/dashboard/dashboardPage';
import MediaPage from './pages/media/mediaPage';
import HomePage from './pages/home/homePage';
import CampaignPage from './pages/campaign/campaignPage';
import DescriptionPage from './pages/description/DescriptionPage';
import ProfilePage from './pages/profile/ProfilePage';
import MyAccountPage from './pages/profile/MyAccountPage';
import EditAccountPage from './pages/profile/EditAccountPage';
import EditAddressPage from './pages/profile/EditAddressPage';
import MyBankPage from './pages/profile/MyBankPage';
import EditBankPage from './pages/profile/EditBankPage';
import SnsPage from './pages/profile/SnsPage';
import EditPasswordPage from './pages/profile/EditPasswordPage';
import ScrollToTop from './components/ScrollToTop'; // Assuming ScrollToTop component is in this location

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage><HomePage /></DashboardPage>} />
          <Route path="/dashboard/campaign" element={<DashboardPage><CampaignPage /></DashboardPage>} />
          <Route path="/dashboard/campaign/:brand/:title" element={<DashboardPage><DescriptionPage /></DashboardPage>} />
          <Route path="/media" element={<DashboardPage><MediaPage /></DashboardPage>} />
          
          {/* Protected Profile Routes */}
          <Route path="/profile/*" element={
            <ProtectedRoute>
              <DashboardPage>
                <Routes>
                  <Route path="/" element={<ProfilePage />} />
                  <Route path="/my-account" element={<MyAccountPage />} />
                  <Route path="/my-account/edit-account" element={<EditAccountPage />} />
                  <Route path="/my-account/edit-address" element={<EditAddressPage />} />
                  <Route path="/my-bank" element={<MyBankPage />} />
                  <Route path="/edit-bank" element={<EditBankPage />} />
                  <Route path="/edit-password" element={<EditPasswordPage />} />
                  <Route path="/sns" element={<SnsPage />} />
                </Routes>
              </DashboardPage>
            </ProtectedRoute>
          } />

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Catch all route - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
