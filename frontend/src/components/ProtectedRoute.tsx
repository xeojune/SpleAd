import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router';
import { authApi } from '../apis/masterAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check if we have user in localStorage
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          setIsAuthenticated(false);
          throw new Error('No user data found');
        }

        // Then verify with server
        const { authenticated, user } = await authApi.isAuthenticated();
        console.log('Auth check result:', { authenticated, user });
        
        if (!authenticated || !user) {
          throw new Error('Not authenticated');
        }
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        
        // Clear all auth data
        localStorage.removeItem('user');
        localStorage.removeItem('user_id');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('x_auth_state');
        localStorage.removeItem('tiktok_auth_state');
        localStorage.removeItem('instagram_user_id');
        
        // Force a logout to clear cookies
        try {
          await authApi.logout();
        } catch (e) {
          console.error('Forced logout failed:', e);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [location.pathname]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  console.log('Authenticated, rendering children');
  return <>{children}</>;
};

export default ProtectedRoute;
