import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // If the user is not authenticated, redirect them to the login page.
    // We also save the location they were trying to access to redirect them back after login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If allowedRoles are specified, check if the user's role is included.
  // If not, redirect them to a 'not authorized' page or back to the dashboard.
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to the user's specific dashboard
    let dashboardPath = '/dashboard/candidate'; // default
    if (user.role === 'ADMIN') {
      dashboardPath = '/dashboard/admin';
    } else if (user.role === 'EMPLOYER') {
      dashboardPath = '/dashboard/employer';
    }

    return <Navigate to={dashboardPath} replace />;
  }

  // Special check for employer verification status
  if (user && user.role === 'EMPLOYER' && allowedRoles?.includes('EMPLOYER')) {
    // Check if employer is verified
    if (user.isVerified === false || user.isVerified === undefined) {
      return <Navigate to="/verification-pending" replace />;
    }
  }

  return <>{children}</>;
};

// The component is now exported as a named export, which matches how it's being imported.
// The default export is removed.