import type { AuthResponse, LoginCredentials } from '@/types/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    return response.json();
  },

  async logout(): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) return;

    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getStoredAuth() {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      return null;
    }

    try {
      const user = JSON.parse(userStr);
      return { token, user };
    } catch {
      return null;
    }
  },

  storeAuth(token: string, user: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
};
