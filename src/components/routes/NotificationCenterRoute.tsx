import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ProtectedRoute } from '../ProtectedRoute';
import { NotificationCenter } from '../NotificationCenter';

export function NotificationCenterRoute() {
  const { user } = useAuth();
  return (
    <ProtectedRoute>
      {user ? <NotificationCenter userId={user.id} userRole={user.role} /> : null}
    </ProtectedRoute>
  );
}
