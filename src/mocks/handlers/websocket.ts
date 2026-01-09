import { ws } from 'msw';
import { mockDevices } from '../data/mockDevices';
import { generateMetrics } from '../data/mockMetrics';
import type { WebSocketMessage } from '../../types/websocket';

const STREAM_INTERVAL = 300; // ms - fast real-time updates

// Store active connections and their intervals
const activeConnections = new Map<WebSocket, ReturnType<typeof setInterval>>();

export const websocketHandler = ws.link('ws://localhost:5173/ws');

export const websocketHandlers = [
  websocketHandler.addEventListener('connection', ({ client }) => {
    console.log('[MSW WebSocket] ✓ Client connected');
    console.log('[MSW WebSocket] Starting metrics stream for 10 devices (300ms interval)');

    let messageCount = 0;

    // Start streaming metrics for all devices
    const intervalId = setInterval(() => {
      // Stream metrics for all 10 devices
      mockDevices.forEach((device) => {
        const metrics = generateMetrics(device.id);

        const message: WebSocketMessage = {
          type: 'metrics',
          deviceId: device.id,
          timestamp: new Date().toISOString(),
          data: {
            ...metrics,
            timestamp: new Date(metrics.timestamp),
          },
        };

        // Send message to client
        try {
          client.send(JSON.stringify(message));
          messageCount++;
          
          // Log every 100 messages (approximately every 3 seconds for 10 devices)
          if (messageCount % 100 === 0) {
            const weight = metrics.weight ?? metrics.netWeight;
            const temp = metrics.temperature ?? 0;
            console.log(`[MSW WebSocket] Sent ${messageCount} messages (latest: ${device.id}, weight: ${weight.toFixed(1)}kg, temp: ${temp.toFixed(1)}°C)`);
          }
        } catch (error) {
          console.error('[MSW WebSocket] Error sending message:', error);
        }
      });
    }, STREAM_INTERVAL);

    // Store the interval ID
    activeConnections.set(client as unknown as WebSocket, intervalId);

    // Handle client messages (if needed)
    client.addEventListener('message', (event) => {
      console.log('[MSW WebSocket] Received message:', event.data);
      
      // Example: Handle ping/pong or commands
      try {
        const data = JSON.parse(event.data as string);
        
        if (data.type === 'ping') {
          client.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
        }
      } catch (error) {
        console.error('[MSW WebSocket] Error parsing message:', error);
      }
    });

    // Handle disconnection
    client.addEventListener('close', () => {
      console.log('[MSW WebSocket] ✗ Client disconnected');
      console.log(`[MSW WebSocket] Total messages sent in this session: ${messageCount}`);
      
      // Clear the interval
      const intervalId = activeConnections.get(client as unknown as WebSocket);
      if (intervalId) {
        clearInterval(intervalId);
        activeConnections.delete(client as unknown as WebSocket);
      }
    });

    // Note: MSW WebSocket client doesn't support 'error' event listener
    // Errors are handled in the 'message' event handler
  }),
];

// Cleanup function (useful for testing)
export const cleanupWebSocketConnections = (): void => {
  activeConnections.forEach((intervalId) => {
    clearInterval(intervalId);
  });
  activeConnections.clear();
};
