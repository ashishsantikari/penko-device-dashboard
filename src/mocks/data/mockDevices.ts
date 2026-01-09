import type { Device, DeviceStatus, ConnectionStatus } from '../../types/device';

// Generate 10 devices with realistic distribution
const deviceStatuses: DeviceStatus[] = [
  'active', 'active', 'active', 'active', 'active', 'active', // 6 active (60%)
  'idle', 'idle', // 2 idle (20%)
  'error', // 1 error (10%)
  'maintenance', // 1 maintenance (10%)
];

const connectionStatuses: ConnectionStatus[] = [
  'connected', 'connected', 'connected', 'connected', 'connected', 
  'connected', 'connected', 'connected', // 8 connected (80%)
  'disconnected', // 1 disconnected (10%)
  'error', // 1 error (10%)
];

// Status percentages based on device status
const statusPercentages: number[] = [
  95, 92, 88, 97, 93, 89, // active devices: 85-100%
  68, 72, // idle devices: 50-75%
  15, // error device: 0-25%
  0, // maintenance device: 0 (not operational)
];

const locations = [
  'Warehouse A',
  'Warehouse A',
  'Warehouse B',
  'Warehouse B',
  'Warehouse C',
  'Production Line 1',
  'Production Line 1',
  'Production Line 2',
  'Storage Facility',
  'Quality Control',
];

// Generate 10 devices: PENKO-1020-001 through PENKO-1020-010
export const mockDevices: Device[] = Array.from({ length: 10 }, (_, index) => {
  const deviceNumber = String(index + 1).padStart(3, '0');
  const deviceId = `PENKO-1020-${deviceNumber}`;
  const deviceName = `Scale A${index + 1}`;

  return {
    id: deviceId,
    name: deviceName,
    type: 'PENKO-1020',
    location: locations[index],
    status: deviceStatuses[index],
    lastUpdate: new Date(),
    connectionStatus: connectionStatuses[index],
    statusPercentage: statusPercentages[index],
  };
});

// Utility functions for device lookup
export const findDeviceById = (id: string): Device | undefined => {
  return mockDevices.find(device => device.id === id);
};

export const getAllDevices = (): Device[] => {
  return [...mockDevices];
};

export const getDeviceCount = (): number => {
  return mockDevices.length;
};
