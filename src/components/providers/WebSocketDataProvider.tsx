import React, { createContext, useContext, useRef, useCallback, useEffect, useState, type ReactNode } from 'react';
import { wsManager } from '@/lib/websocket/WebSocketManager';
import type { WebSocketMessage } from '@/types/websocket';
import type { DeviceMetrics } from '@/types/device';

// Subscription callback type
type MetricsCallback = (metrics: DeviceMetrics) => void;

interface WebSocketDataContextType {
  subscribe: (deviceId: string, callback: MetricsCallback) => () => void;
  getLatestMetrics: (deviceId: string) => DeviceMetrics | undefined;
  getAllMetrics: () => Map<string, DeviceMetrics>;
}

const WebSocketDataContext = createContext<WebSocketDataContextType | undefined>(undefined);

// Store for latest metrics - exported for dashboard access
export const metricsStore = new Map<string, DeviceMetrics>();

// Expose to window for dashboard polling
if (typeof window !== 'undefined') {
  (window as any).__deviceMetricsStore = metricsStore;
}

export const WebSocketDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const subscriptionsRef = useRef<Map<string, Set<MetricsCallback>>>(new Map());
  const messageCountRef = useRef(0);

  const subscribe = useCallback((deviceId: string, callback: MetricsCallback) => {
    if (!subscriptionsRef.current.has(deviceId)) {
      subscriptionsRef.current.set(deviceId, new Set());
    }
    subscriptionsRef.current.get(deviceId)!.add(callback);

    // Immediately call with cached data if available
    const cached = metricsStore.get(deviceId);
    if (cached) {
      callback(cached);
    }

    // Return unsubscribe function
    return () => {
      subscriptionsRef.current.get(deviceId)?.delete(callback);
    };
  }, []);

  const getLatestMetrics = useCallback((deviceId: string) => {
    return metricsStore.get(deviceId);
  }, []);

  const getAllMetrics = useCallback(() => {
    return new Map(metricsStore);
  }, []);

  useEffect(() => {
    const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';
    
    console.log('[WebSocketDataProvider] Initializing connection to:', WS_URL);
    
    wsManager.initialize({ url: WS_URL });

    const client = wsManager.getClient();
    if (!client) {
      console.error('[WebSocketDataProvider] Failed to get client');
      return;
    }

    const handleMessage = (message: WebSocketMessage) => {
      messageCountRef.current++;
      
      // Log every 50 messages
      if (messageCountRef.current % 50 === 0) {
        console.log(`[WebSocketDataProvider] Processed ${messageCountRef.current} messages`);
      }

      // Store in cache
      metricsStore.set(message.deviceId, message.data);

      // Notify subscribers for this specific device only
      const callbacks = subscriptionsRef.current.get(message.deviceId);
      if (callbacks) {
        callbacks.forEach(callback => {
          try {
            callback(message.data);
          } catch (error) {
            console.error(`[WebSocketDataProvider] Error in callback for ${message.deviceId}:`, error);
          }
        });
      }
    };

    client.on('message', handleMessage);

    return () => {
      console.log('[WebSocketDataProvider] Cleaning up, processed', messageCountRef.current, 'messages');
      client.off('message', handleMessage);
      wsManager.disconnect();
      metricsStore.clear();
      subscriptionsRef.current.clear();
    };
  }, []);

  return (
    <WebSocketDataContext.Provider value={{ subscribe, getLatestMetrics, getAllMetrics }}>
      {children}
    </WebSocketDataContext.Provider>
  );
};

export const useWebSocketData = () => {
  const context = useContext(WebSocketDataContext);
  if (context === undefined) {
    throw new Error('useWebSocketData must be used within a WebSocketDataProvider');
  }
  return context;
};

// Hook to subscribe to a specific device's metrics
export const useDeviceMetricsSubscription = (deviceId: string) => {
  const { subscribe, getLatestMetrics } = useWebSocketData();
  const [metrics, setMetrics] = useState<DeviceMetrics | undefined>(() => 
    getLatestMetrics(deviceId)
  );

  useEffect(() => {
    if (!deviceId) return;

    const unsubscribe = subscribe(deviceId, (newMetrics) => {
      setMetrics(newMetrics);
    });

    return unsubscribe;
  }, [deviceId, subscribe]);

  return metrics;
};

// Hook to subscribe to multiple devices
export const useDevicesMetricsSubscription = (deviceIds: string[]) => {
  const { subscribe } = useWebSocketData();
  const [metricsMap, setMetricsMap] = useState<Map<string, DeviceMetrics>>(new Map());

  useEffect(() => {
    if (!deviceIds.length) return;

    const unsubscribes: (() => void)[] = [];

    deviceIds.forEach((deviceId) => {
      const unsubscribe = subscribe(deviceId, (metrics) => {
        setMetricsMap((prev) => {
          const next = new Map(prev);
          next.set(deviceId, metrics);
          return next;
        });
      });
      unsubscribes.push(unsubscribe);
    });

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [deviceIds.join(','), subscribe]);

  return metricsMap;
};

// Hook to get all metrics (for dashboard charts)
export const useAllMetrics = () => {
  const { getAllMetrics } = useWebSocketData();
  const [allMetrics, setAllMetrics] = useState<Map<string, DeviceMetrics>>(new Map());

  useEffect(() => {
    const interval = setInterval(() => {
      setAllMetrics(getAllMetrics());
    }, 100);

    return () => clearInterval(interval);
  }, [getAllMetrics]);

  return allMetrics;
};
