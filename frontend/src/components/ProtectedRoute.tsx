import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';
import type { ReactNode } from 'react';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = authService.getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
