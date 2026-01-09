// Re-export all types from submodules
export * from './auth';
export * from './device';
export * from './websocket';

// For backward compatibility, add some type aliases
export type { LoginCredentials as LoginRequest } from './auth';
export type { AuthResponse as LoginResponse } from './auth';

