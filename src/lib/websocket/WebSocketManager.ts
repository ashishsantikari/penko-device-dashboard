import { WebSocketClient } from './WebSocketClient';
import type { WebSocketConfig } from '@/types/websocket';

class WebSocketManager {
  private client: WebSocketClient | null = null;

  initialize(config: WebSocketConfig): void {
    if (this.client) {
      this.client.disconnect();
    }

    this.client = new WebSocketClient(config);
    this.client.connect();
  }

  getClient(): WebSocketClient | null {
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
