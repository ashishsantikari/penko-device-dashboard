import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    name: string;
  };
}

const VALID_USERNAME = 'admin';
const VALID_PASSWORD = 'admin';

const generateToken = (username: string): string => {
  const payload = {
    sub: username,
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000,
  };
  return `mock.${Buffer.from(JSON.stringify(payload)).toString('base64')}.signature`;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

const handleLogin = async (event: HandlerEvent): Promise<HandlerResponse> => {
  try {
    const body = JSON.parse(event.body || '{}') as LoginCredentials;
    const { username, password } = body;

    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      const response: AuthResponse = {
        token: generateToken(username),
        user: {
          id: '1',
          username,
          name: 'Admin User',
        },
      };
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(response),
      };
    }

    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Invalid username or password' }),
    };
  } catch {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Invalid request body' }),
    };
  }
};

const handleLogout = (): HandlerResponse => {
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ message: 'Logged out successfully' }),
  };
};

interface HandlerResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  const path = event.path.replace(/\/.netlify\/functions\//, '');

  if (path === 'auth/login' && event.httpMethod === 'POST') {
    return handleLogin(event);
  }

  if (path === 'auth/logout' && event.httpMethod === 'POST') {
    return handleLogout();
  }

  return {
    statusCode: 404,
    headers: corsHeaders,
    body: JSON.stringify({ error: 'Not found' }),
  };
};

export { handler };
