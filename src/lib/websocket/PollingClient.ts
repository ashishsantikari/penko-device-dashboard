import type { WebSocketConfig, WebSocketMessage } from '@/types/websocket';

type MessageHandler = (message: WebSocketMessage) => void;
type ErrorHandler = (error: Event) => void;
type ConnectionHandler = () => void;

const POLL_INTERVAL = 1000; // 1s — keeps Netlify request credits well within free tier

export class PollingClient {
  private config: WebSocketConfig;
  private pollingTimer: ReturnType<typeof setInterval> | null = null;
  private abortController: AbortController | null = null;
  private messageHandlers: MessageHandler[] = [];
  private errorHandlers: ErrorHandler[] = [];
  private openHandlers: ConnectionHandler[] = [];
  private closeHandlers: ConnectionHandler[] = [];
  private _readyState: number = WebSocket.CLOSED;

  constructor(config: WebSocketConfig) {
    this.config = {
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      ...config,
    };
  }

  connect(): void {
    if (this.pollingTimer) return;

    console.log('[Polling Client] Starting poll to:', this.config.url);
    this._readyState = WebSocket.OPEN;
    this.openHandlers.forEach((handler) => handler());

    this.poll();

    this.pollingTimer = setInterval(() => {
      this.poll();
    }, POLL_INTERVAL);
  }

  private async poll(): Promise<void> {
    this.abortController = new AbortController();

    try {
      const response = await fetch(this.config.url, {
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const messages: WebSocketMessage[] = await response.json();

      messages.forEach((message) => {
        this.messageHandlers.forEach((handler) => {
          try {
            handler(message);
          } catch (error) {
            console.error('[Polling Client] Handler error:', error);
          }
        });
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }
      console.error('[Polling Client] Request failed:', error);
      const event = new Event('error');
      this.errorHandlers.forEach((handler) => handler(event));
    }
  }

  disconnect(): void {
    console.log('[Polling Client] Stopping poll');
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
      this.pollingTimer = null;
    }
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    this._readyState = WebSocket.CLOSED;
    this.closeHandlers.forEach((handler) => handler());
  }

  on(event: 'message', handler: MessageHandler): void;
  on(event: 'error', handler: ErrorHandler): void;
  on(event: 'open', handler: ConnectionHandler): void;
  on(event: 'close', handler: ConnectionHandler): void;
  on(event: string, handler: MessageHandler | ErrorHandler | ConnectionHandler): void {
    switch (event) {
      case 'message':
        this.messageHandlers.push(handler as MessageHandler);
        break;
      case 'error':
        this.errorHandlers.push(handler as ErrorHandler);
        break;
      case 'open':
        this.openHandlers.push(handler as ConnectionHandler);
        break;
      case 'close':
        this.closeHandlers.push(handler as ConnectionHandler);
        break;
    }
  }

  off(event: 'message', handler: MessageHandler): void;
  off(event: 'error', handler: ErrorHandler): void;
  off(event: 'open', handler: ConnectionHandler): void;
  off(event: 'close', handler: ConnectionHandler): void;
  off(event: string, handler: MessageHandler | ErrorHandler | ConnectionHandler): void {
    switch (event) {
      case 'message':
        this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
        break;
      case 'error':
        this.errorHandlers = this.errorHandlers.filter((h) => h !== handler);
        break;
      case 'open':
        this.openHandlers = this.openHandlers.filter((h) => h !== handler);
        break;
      case 'close':
        this.closeHandlers = this.closeHandlers.filter((h) => h !== handler);
        break;
    }
  }

  send(_data: unknown): void {
    void _data;
  }

  getReadyState(): number {
    return this._readyState;
  }
}
