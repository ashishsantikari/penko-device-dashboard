import { http, HttpResponse } from 'msw';
import type { LoginCredentials, AuthResponse } from '../../types/auth';

const VALID_USERNAME = 'admin';
const VALID_PASSWORD = 'admin';

// Generate a simple JWT-like token (for mock purposes)
const generateToken = (username: string): string => {
  const payload = {
    sub: username,
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };
  // In a real app, this would be properly signed
  return `mock.${btoa(JSON.stringify(payload))}.signature`;
};

export const authHandlers = [
  // POST /api/auth/login
  http.post('/api/auth/login', async ({ request }) => {
    try {
      const body = await request.json() as LoginCredentials;
      const { username, password } = body;

      // Validate credentials
      if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        const response: AuthResponse = {
          token: generateToken(username),
          user: {
            id: '1',
            username,
            name: 'Admin User',
          },
        };

        return HttpResponse.json(response, { status: 200 });
      }

      // Invalid credentials
      return HttpResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    } catch {
      return HttpResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }
  }),

  // POST /api/auth/logout
  http.post('/api/auth/logout', () => {
    return HttpResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );
  }),
];
