import type { Device, DeviceMetrics } from '@/types/device';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const deviceService = {
  async getAllDevices(token: string): Promise<Device[]> {
    const response = await fetch(`${API_BASE_URL}/devices`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch devices');
    }

    const devices = await response.json();
    return devices.map((device: any) => ({
      ...device,
      lastUpdate: new Date(device.lastUpdate),
    }));
  },

  async getDevice(id: string, token: string): Promise<Device> {
    const response = await fetch(`${API_BASE_URL}/devices/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch device');
    }

    const device = await response.json();
    return {
      ...device,
      lastUpdate: new Date(device.lastUpdate),
    };
  },

  async getDeviceMetrics(deviceId: string, token: string): Promise<DeviceMetrics[]> {
    const response = await fetch(`${API_BASE_URL}/devices/${deviceId}/metrics`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch device metrics');
    }

    const metrics = await response.json();
    return metrics.map((metric: any) => ({
      ...metric,
      timestamp: new Date(metric.timestamp),
    }));
  },
};
