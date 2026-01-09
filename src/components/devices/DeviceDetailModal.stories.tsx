/* eslint-disable storybook/no-renderer-packages */
import type { Meta, StoryObj } from '@storybook/react';
import { DeviceDetailModal } from './DeviceDetailModal';
import type { Device, DeviceMetrics } from '@/types/device';

// Mock device data
const mockDevice: Device = {
  id: 'PENKO-1020-001',
  name: 'Scale A1',
  type: 'PENKO-1020',
  location: 'Warehouse A',
  status: 'active',
  lastUpdate: new Date(),
  connectionStatus: 'connected',
  statusPercentage: 95,
};

const mockDeviceOffline: Device = {
  ...mockDevice,
  id: 'PENKO-1020-002',
  name: 'Scale A2',
  status: 'idle',
  connectionStatus: 'disconnected',
  statusPercentage: 0,
};

// Mock metrics
const mockMetrics: DeviceMetrics = {
  deviceId: 'PENKO-1020-001',
  timestamp: new Date(),
  grossWeight: 275.67,
  tareWeight: 30.00,
  netWeight: 245.67,
  status: 'active',
  isStable: true,
  loadCellCount: 4,
  measuringSpeed: 1600,
  temperature: 21.5,
  weight: 245.67,
  batteryLevel: 85,
  humidity: 45,
};

const mockMetricsUnstable: DeviceMetrics = {
  ...mockMetrics,
  isStable: false,
  netWeight: 245.89,
  grossWeight: 275.89,
};

const meta: Meta<typeof DeviceDetailModal> = {
  title: 'Devices/DeviceDetailModal',
  component: DeviceDetailModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DeviceDetailModal>;

export const Open: Story = {
  args: {
    device: mockDevice,
    metrics: mockMetrics,
    isOpen: true,
    onClose: () => {},
  },
};

export const Closed: Story = {
  args: {
    device: mockDevice,
    metrics: mockMetrics,
    isOpen: false,
    onClose: () => {},
  },
};

export const NoMetrics: Story = {
  args: {
    device: mockDevice,
    metrics: undefined,
    isOpen: true,
    onClose: () => {},
  },
};

export const Unstable: Story = {
  args: {
    device: mockDevice,
    metrics: mockMetricsUnstable,
    isOpen: true,
    onClose: () => {},
  },
};

export const Offline: Story = {
  args: {
    device: mockDeviceOffline,
    metrics: undefined,
    isOpen: true,
    onClose: () => {},
  },
};

export const NoLocation: Story = {
  args: {
    device: { ...mockDevice, location: undefined },
    metrics: mockMetrics,
    isOpen: true,
    onClose: () => {},
  },
};

export const NoDevice: Story = {
  args: {
    device: null,
    metrics: undefined,
    isOpen: true,
    onClose: () => {},
  },
};
