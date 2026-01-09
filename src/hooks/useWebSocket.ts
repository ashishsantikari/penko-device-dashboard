import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { wsManager } from '@/lib/websocket/WebSocketManager';
import type { WebSocketMessage } from '@/types/websocket';
import type { DeviceMetrics } from '@/types/device';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';

export const useWebSocket = () => {
  const queryClient = useQueryClient();
  const messageCountRef = useRef(0);

  useEffect(() => {
    console.log('[useWebSocket] Initializing connection to:', WS_URL);
    
    // Initialize WebSocket connection
    wsManager.initialize({ url: WS_URL });

    const client = wsManager.getClient();
    if (!client) {
      console.error('[useWebSocket] Failed to get client');
      return;
    }

    const handleMessage = (message: WebSocketMessage) => {
      messageCountRef.current++;
      
      // Log every 50 messages
      if (messageCountRef.current % 50 === 0) {
        console.log(`[useWebSocket] Processed ${messageCountRef.current} messages. Latest:`, {
          deviceId: message.deviceId,
          weight: message.data.weight?.toFixed(1),
          temp: message.data.temperature?.toFixed(1)
        });
      }

      // Store the latest metrics for each device in a separate cache key
      queryClient.setQueryData<DeviceMetrics>(
        ['device-latest-metrics', message.deviceId],
        message.data
      );

      // Also append to historical metrics
      queryClient.setQueryData<DeviceMetrics[]>(
        ['device-metrics', message.deviceId],
        (old = []) => [...old, message.data]
      );

      // Update device in devices list
      queryClient.setQueryData<any[]>(
        ['devices'],
        (devices = []) => devices.map(device => 
          device.id === message.deviceId
            ? {
                ...device,
                status: message.data.status,
                lastUpdate: message.data.timestamp,
                connectionStatus: 'connected'
              }
            : device
        )
      );
    };

    client.on('message', handleMessage);

    return () => {
      console.log('[useWebSocket] Cleaning up, processed', messageCountRef.current, 'messages');
      client.off('message', handleMessage);
      wsManager.disconnect();
    };
  }, [queryClient]);
};
