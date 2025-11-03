import React from 'react';
import { ProtectedRoute } from '../ProtectedRoute';
import { AnalyticsDashboard } from '../AnalyticsDashboard';
import { useAuth } from '../../contexts/AuthContext';

export function AnalyticsRoute() {
  const { user } = useAuth();
  return (
    <ProtectedRoute allowedRoles={['ADMIN','EMPLOYER']}>
      {user ? (
        <AnalyticsDashboard userRole={user.role as 'admin' | 'employer'} userId={user.id} />
      ) : null}
    </ProtectedRoute>
  );
}
