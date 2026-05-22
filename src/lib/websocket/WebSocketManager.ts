import { WebSocketClient } from './WebSocketClient';
import { PollingClient } from './PollingClient';
import type { WebSocketConfig, WebSocketMessage } from '@/types/websocket';

type MessageHandler = (message: WebSocketMessage) => void;
type ErrorHandler = (error: Event) => void;
type ConnectionHandler = () => void;

interface RealtimeClient {
  connect(): void;
  disconnect(): void;
  on(event: 'message', handler: MessageHandler): void;
  on(event: 'error', handler: ErrorHandler): void;
  on(event: 'open', handler: ConnectionHandler): void;
  on(event: 'close', handler: ConnectionHandler): void;
  off(event: 'message', handler: MessageHandler): void;
  off(event: 'error', handler: ErrorHandler): void;
  off(event: 'open', handler: ConnectionHandler): void;
  off(event: 'close', handler: ConnectionHandler): void;
  send(data: unknown): void;
  getReadyState(): number;
}

function isWebSocketUrl(url: string): boolean {
  return url.startsWith('ws://') || url.startsWith('wss://');
}

class WebSocketManager {
  private client: RealtimeClient | null = null;

  initialize(config: WebSocketConfig): void {
    if (this.client) {
      this.client.disconnect();
    }

    if (isWebSocketUrl(config.url)) {
      console.log('[WebSocketManager] Using WebSocket connection for:', config.url);
      this.client = new WebSocketClient(config);
    } else {
      console.log('[WebSocketManager] Using polling connection for:', config.url);
      this.client = new PollingClient(config);
    }

    this.client.connect();
  }

  getClient(): RealtimeClient | null {
    return this.client;
  }

  disconnect(): void {
    if (this.client) {
      this.client.disconnect();
      this.client = null;
    }
  }
}

export const wsManager = new WebSocketManager();
