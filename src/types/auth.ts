export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
