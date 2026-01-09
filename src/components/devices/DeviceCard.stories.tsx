/* eslint-disable storybook/no-renderer-packages */
import type { Meta, StoryObj } from '@storybook/react';
import React, { useEffect } from 'react';
import { DeviceCard } from './DeviceCard';
import type { Device, DeviceMetrics } from '@/types/device';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WebSocketDataProvider, metricsStore } from '@/components/providers/WebSocketDataProvider';

// Mock device data
const mockDevice: Device = {
  id: 'PENKO-1020-001',
  name: 'Scale A1',
  type: 'PENKO-1020',
  location: 'Warehouse A',
  status: 'active',
  lastUpdate: new Date('2026-01-29T18:30:00'),
  connectionStatus: 'connected',
  statusPercentage: 95,
};

const mockDeviceIdle: Device = {
  ...mockDevice,
  id: 'PENKO-1020-002',
  name: 'Scale A2',
  status: 'idle',
  statusPercentage: 68,
  lastUpdate: new Date('2026-01-29T18:25:00'),
};

const mockDeviceError: Device = {
  ...mockDevice,
  id: 'PENKO-1020-003',
  name: 'Scale A3',
  status: 'error',
  connectionStatus: 'error',
  statusPercentage: 15,
  lastUpdate: new Date('2026-01-29T18:20:00'),
};

// Mock device metrics for Penko 1020 weighing indicators
const mockActiveMetrics: DeviceMetrics = {
  deviceId: 'PENKO-1020-001',
  timestamp: new Date('2026-01-29T18:30:00'),
  grossWeight: 275.67,
  tareWeight: 30.00,
  netWeight: 245.67,
  status: 'active',
  isStable: true,
  loadCellCount: 2,
  measuringSpeed: 1600,
  temperature: 21.3,
  // Legacy fields
  weight: 245.67,
  batteryLevel: 95,
  humidity: 52,
};

const mockIdleMetrics: DeviceMetrics = {
  deviceId: 'PENKO-1020-002',
  timestamp: new Date('2026-01-29T18:25:00'),
  grossWeight: 85.42,
  tareWeight: 45.00,
  netWeight: 40.42,
  status: 'idle',
  isStable: true,
  loadCellCount: 4,
  measuringSpeed: 1600,
  temperature: 22.8,
  // Legacy fields
  weight: 40.42,
  batteryLevel: 68,
  humidity: 48,
};

const mockErrorMetrics: DeviceMetrics = {
  deviceId: 'PENKO-1020-003',
  timestamp: new Date('2026-01-29T18:20:00'),
  grossWeight: 532.15,
  tareWeight: 55.00,
  netWeight: 477.15,
  status: 'error',
  isStable: false,
  loadCellCount: 3,
  measuringSpeed: 1600,
  temperature: 24.5,
  // Legacy fields
  weight: 477.15,
  batteryLevel: 15,
  humidity: 55,
};

const meta: Meta<typeof DeviceCard> = {
  title: 'Devices/DeviceCard',
  component: DeviceCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      });

      return (
        <QueryClientProvider client={queryClient}>
          <WebSocketDataProvider>
            <div style={{ maxWidth: '280px', margin: '0 auto' }}>
              <Story />
            </div>
          </WebSocketDataProvider>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof DeviceCard>;

export const Active: Story = {
  args: {
    device: mockDevice,
  },
  decorators: [
    (Story) => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      });
      
      // Pre-populate the metrics store
      metricsStore.set(mockDevice.id, mockActiveMetrics);

      return (
        <QueryClientProvider client={queryClient}>
          <WebSocketDataProvider>
            <div style={{ maxWidth: '280px', margin: '0 auto' }}>
              <Story />
            </div>
          </WebSocketDataProvider>
        </QueryClientProvider>
      );
    },
  ],
};

export const Idle: Story = {
  args: {
    device: mockDeviceIdle,
  },
  decorators: [
    (Story) => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      });
      
      // Pre-populate the metrics store
      metricsStore.set(mockDeviceIdle.id, mockIdleMetrics);

      return (
        <QueryClientProvider client={queryClient}>
          <WebSocketDataProvider>
            <div style={{ maxWidth: '280px', margin: '0 auto' }}>
              <Story />
            </div>
          </WebSocketDataProvider>
        </QueryClientProvider>
      );
    },
  ],
};

export const Error: Story = {
  args: {
    device: mockDeviceError,
  },
  decorators: [
    (Story) => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      });
      
      // Pre-populate the metrics store
      metricsStore.set(mockDeviceError.id, mockErrorMetrics);

      return (
        <QueryClientProvider client={queryClient}>
          <WebSocketDataProvider>
            <div style={{ maxWidth: '280px', margin: '0 auto' }}>
              <Story />
            </div>
          </WebSocketDataProvider>
        </QueryClientProvider>
      );
    },
  ],
};

export const DarkTheme: Story = {
  args: {
    device: mockDevice,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      });
      
      // Pre-populate the metrics store
      metricsStore.set(mockDevice.id, mockActiveMetrics);

      return (
        <QueryClientProvider client={queryClient}>
          <WebSocketDataProvider>
            <div className="dark">
              <div style={{ maxWidth: '280px', margin: '0 auto' }}>
                <Story />
              </div>
            </div>
          </WebSocketDataProvider>
        </QueryClientProvider>
      );
    },
  ],
};

export const LiveUpdating: Story = {
  args: {
    device: mockDevice,
  },
  decorators: [
    (Story) => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      });
      
      // Initial metrics
      metricsStore.set(mockDevice.id, mockActiveMetrics);

      // Simulate WebSocket updates every 1000ms
      const updateInterval = setInterval(() => {
        const currentMetrics = metricsStore.get(mockDevice.id);
        
        if (currentMetrics) {
          // Simulate realistic weight changes (small variations)
          const weightChange = (Math.random() - 0.5) * 5; // ±2.5kg
          const tempChange = (Math.random() - 0.5) * 0.3; // ±0.15°C
          
          const newNetWeight = Math.max(0, currentMetrics.netWeight + weightChange);
          const newGrossWeight = newNetWeight + currentMetrics.tareWeight;
          const newTemp = currentMetrics.temperature ? currentMetrics.temperature + tempChange : 21.3;
          const isStable = Math.abs(weightChange) < 0.5;
          
          const updatedMetrics: DeviceMetrics = {
            ...currentMetrics,
            netWeight: newNetWeight,
            grossWeight: newGrossWeight,
            temperature: newTemp,
            isStable,
            timestamp: new Date(),
          };
          
          metricsStore.set(mockDevice.id, updatedMetrics);
        }
      }, 1000);

      // Cleanup function
      const cleanup = () => {
        clearInterval(updateInterval);
      };

      // Cleanup on unmount
      return (
        <QueryClientProvider client={queryClient}>
          <WebSocketDataProvider>
            <div style={{ maxWidth: '280px', margin: '0 auto' }}>
              <Story />
            </div>
            {/* Cleanup component */}
            <CleanupComponent onCleanup={cleanup} />
          </WebSocketDataProvider>
        </QueryClientProvider>
      );
    },
  ],
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates live weight updates simulating WebSocket connection. Values update every second with realistic variations.',
      },
    },
  },
};

// Cleanup component to handle unmount
const CleanupComponent: React.FC<{ onCleanup: () => void }> = ({ onCleanup }) => {
  useEffect(() => {
    return () => {
      onCleanup();
    };
  }, [onCleanup]);
  
  return null;
};
