import React, { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Redirect } from 'wouter';

interface PrivateRouteProps {
  children: ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
};
