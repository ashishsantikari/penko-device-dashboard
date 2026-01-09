import type { WebSocketConfig, WebSocketMessage } from '@/types/websocket';

type MessageHandler = (message: WebSocketMessage) => void;
type ErrorHandler = (error: Event) => void;
type ConnectionHandler = () => void;

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private reconnectAttempts = 0;
  private messageHandlers: MessageHandler[] = [];
  private errorHandlers: ErrorHandler[] = [];
  private openHandlers: ConnectionHandler[] = [];
  private closeHandlers: ConnectionHandler[] = [];
  private reconnectTimeout: NodeJS.Timeout | null = null;

  constructor(config: WebSocketConfig) {
    this.config = {
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      ...config,
    };
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      this.ws = new WebSocket(this.config.url);

      this.ws.onopen = () => {
        console.log('[WebSocket Client] ✓ Connected to:', this.config.url);
        this.reconnectAttempts = 0;
        this.openHandlers.forEach(handler => handler());
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.messageHandlers.forEach(handler => handler(message));
        } catch (error) {
          console.error('[WebSocket Client] Failed to parse message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.errorHandlers.forEach(handler => handler(error));
      };

      this.ws.onclose = () => {
        console.log('WebSocket closed');
        this.closeHandlers.forEach(handler => handler());
        this.handleReconnect();
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      this.handleReconnect();
    }
  }

  private handleReconnect(): void {
    if (
      this.reconnectAttempts < (this.config.maxReconnectAttempts || 10)
    ) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
      
      this.reconnectTimeout = setTimeout(() => {
        this.connect();
      }, this.config.reconnectInterval || 5000);
    } else {
      console.error('Max reconnect attempts reached');
    }
  }

  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  on(event: 'message', handler: MessageHandler): void;
  on(event: 'error', handler: ErrorHandler): void;
  on(event: 'open', handler: ConnectionHandler): void;
  on(event: 'close', handler: ConnectionHandler): void;
  on(event: string, handler: any): void {
    switch (event) {
      case 'message':
        this.messageHandlers.push(handler);
        break;
      case 'error':
        this.errorHandlers.push(handler);
        break;
      case 'open':
        this.openHandlers.push(handler);
        break;
      case 'close':
        this.closeHandlers.push(handler);
        break;
    }
  }

  off(event: 'message', handler: MessageHandler): void;
  off(event: 'error', handler: ErrorHandler): void;
  off(event: 'open', handler: ConnectionHandler): void;
  off(event: 'close', handler: ConnectionHandler): void;
  off(event: string, handler: any): void {
    switch (event) {
      case 'message':
        this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
        break;
      case 'error':
        this.errorHandlers = this.errorHandlers.filter(h => h !== handler);
        break;
      case 'open':
        this.openHandlers = this.openHandlers.filter(h => h !== handler);
        break;
      case 'close':
        this.closeHandlers = this.closeHandlers.filter(h => h !== handler);
        break;
    }
  }

  send(data: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  getReadyState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }
}
