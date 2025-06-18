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
        const { authenticated, user } = await authApi.isAuthenticated();
        console.log('Auth check result:', { authenticated, user }); // Debug log
        setIsAuthenticated(authenticated);
      } catch (error) {
        console.error('Auth check failed:', error); // Debug log
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [location.pathname]); // Re-run when path changes

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login'); // Debug log
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  console.log('Authenticated, rendering children'); // Debug log
  return <>{children}</>;
};

export default ProtectedRoute;
