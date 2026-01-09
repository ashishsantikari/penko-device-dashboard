import { authHandlers } from './auth';
import { deviceHandlers } from './devices';
import { websocketHandlers } from './websocket';

// Combine all handlers
export const handlers = [
  ...authHandlers,
  ...deviceHandlers,
  ...websocketHandlers,
];
