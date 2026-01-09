import { useQuery } from '@tanstack/react-query';
import { deviceService } from '@/services/deviceService';
import { useAuth } from './useAuth';
import { useDeviceMetricsSubscription } from '@/components/providers/WebSocketDataProvider';
import type { Device, DeviceMetrics } from '@/types/device';

export const useDevices = () => {
  const { token } = useAuth();

  return useQuery<Device[]>({
    queryKey: ['devices'],
    queryFn: () => deviceService.getAllDevices(token!),
    enabled: !!token,
  });
};

export const useDevice = (deviceId: string) => {
  const { token } = useAuth();

  return useQuery<Device>({
    queryKey: ['device', deviceId],
    queryFn: () => deviceService.getDevice(deviceId, token!),
    enabled: !!token && !!deviceId,
  });
};

export const useDeviceMetrics = (deviceId: string) => {
  const { token } = useAuth();

  return useQuery<DeviceMetrics[]>({
    queryKey: ['device-metrics', deviceId],
    queryFn: () => deviceService.getDeviceMetrics(deviceId, token!),
    enabled: !!token && !!deviceId,
    initialData: [],
  });
};

// Hook to get the latest metrics from WebSocket updates (real-time)
export const useLatestDeviceMetrics = (deviceId: string) => {
  return useDeviceMetricsSubscription(deviceId);
};
