import React, { createContext, useState, useEffect, ReactNode } from 'react';
import type { User, AuthState } from '@/types/auth';
import { authService } from '@/services/authService';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const stored = authService.getStoredAuth();
    if (stored) {
      setAuthState({
        user: stored.user,
        token: stored.token,
        isAuthenticated: true,
      });
    }
  }, []);

  const login = async (username: string, password: string) => {
    const response = await authService.login({ username, password });
    authService.storeAuth(response.token, response.user);
    setAuthState({
      user: response.user,
      token: response.token,
      isAuthenticated: true,
    });
  };

  const logout = async () => {
    await authService.logout();
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
