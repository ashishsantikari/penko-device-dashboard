import type { DeviceMetrics } from './device';

export type WebSocketMessageType = 'metrics' | 'status' | 'error';

export interface WebSocketMessage {
  type: WebSocketMessageType;
  deviceId: string;
  timestamp: string;
  data: DeviceMetrics;
}

export interface WebSocketConfig {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}
