import type { DeviceMetrics, DeviceStatus } from '../../types/device';
import { mockDevices } from './mockDevices';

// Store previous metrics for smooth transitions
const metricsState = new Map<string, DeviceMetrics>();
// Store last active metrics for offline devices
const lastActiveMetrics = new Map<string, DeviceMetrics>();

// Initialize metrics for a device with realistic base values for Penko 1020 weighing indicator
const initializeMetrics = (deviceId: string): DeviceMetrics => {
  // Extract device number from ID (e.g., "PENKO-1020-001" -> 1)
  const deviceNum = parseInt(deviceId.split('-').pop() || '1');
  
  // Different tare weights for different devices (container/platform weight)
  const tareWeight = 20 + (deviceNum * 5); // 25kg to 70kg range
  
  // Different base net weights for different devices
  const baseNetWeight = 100 + (deviceNum * 50); // 150kg to 600kg range
  
  // Temperature around room temperature (if sensor present)
  const baseTemp = 20 + (deviceNum % 5) * 0.5; // 20-22.5°C range
  
  const netWeight = baseNetWeight + (Math.random() * 20 - 10); // ±10kg from base
  const grossWeight = netWeight + tareWeight;
  
  return {
    deviceId,
    timestamp: new Date(),
    grossWeight,
    tareWeight,
    netWeight,
    isStable: true,
    loadCellCount: Math.min(deviceNum % 4 + 1, 8), // 1-4 load cells per device
    measuringSpeed: 1600, // Max speed for Penko 1020
    status: 'active' as DeviceStatus,
    temperature: baseTemp + (Math.random() * 2 - 1), // ±1°C from base
    // Legacy fields for compatibility
    weight: netWeight,
    batteryLevel: 80 + Math.random() * 20,
    humidity: 45 + Math.random() * 10,
  };
};

// Check if device is active (only active devices get new data)
const isDeviceActive = (deviceId: string): boolean => {
  const device = mockDevices.find(d => d.id === deviceId);
  if (!device) return true; // Default to active if not found
  
  // Only 'active' status devices get new data
  // Idle, error, maintenance, and disconnected devices show last active data or null
  return device.connectionStatus === 'connected' && device.status === 'active';
};

// Generate realistic net weight changes (scales detecting items being added/removed)
const generateNetWeight = (previousNetWeight: number, deviceId: string): number => {
  const deviceNum = parseInt(deviceId.split('-').pop() || '1');
  const baseWeight = 100 + (deviceNum * 50);
  
  // 60% chance of small change (±1kg), 25% chance of medium change (±10kg), 
  // 10% chance of large change (±30kg), 5% chance of very large (±100kg)
  const rand = Math.random();
  let change: number;
  
  if (rand < 0.6) {
    // Small fluctuation (measurement noise, vibration)
    change = (Math.random() - 0.5) * 2; // ±1kg
  } else if (rand < 0.85) {
    // Medium change (items added/removed)
    change = (Math.random() - 0.5) * 20; // ±10kg
  } else if (rand < 0.95) {
    // Large change (bulk items)
    change = (Math.random() - 0.5) * 60; // ±30kg
  } else {
    // Very large change (full load/unload)
    change = (Math.random() - 0.5) * 200; // ±100kg
  }
  
  const newWeight = previousNetWeight + change;
  
  // Keep weight within realistic bounds (0kg to baseWeight + 300kg)
  const minWeight = 0;
  const maxWeight = baseWeight + 300;
  
  return Math.max(minWeight, Math.min(maxWeight, Number(newWeight.toFixed(2))));
};

// Generate realistic tare weight (mostly stable, occasional recalibration)
const generateTareWeight = (previousTareWeight: number): number => {
  // 99% chance tare stays the same, 1% chance it changes (recalibration)
  if (Math.random() < 0.99) {
    return previousTareWeight;
  }
  
  // Tare recalibration (slight adjustment)
  const change = (Math.random() - 0.5) * 1; // ±0.5kg
  const newTare = previousTareWeight + change;
  return Math.max(10, Math.min(100, Number(newTare.toFixed(2))));
};

// Generate weight stability (becomes false when weight changes significantly)
const generateStability = (previousWeight: number, newWeight: number): boolean => {
  const weightChange = Math.abs(newWeight - previousWeight);
  // Stable if change is less than 0.5kg
  return weightChange < 0.5;
};

// Generate realistic temperature changes (environmental variations)
const generateTemperature = (previousTemp?: number): number | undefined => {
  if (previousTemp === undefined) return undefined;
  
  // Very small gradual changes (environmental drift)
  const change = (Math.random() - 0.5) * 0.2; // ±0.1°C
  const newTemp = previousTemp + change;
  
  // Keep temperature within realistic indoor range
  return Math.max(18, Math.min(26, Number(newTemp.toFixed(1))));
};

// Rarely change status (1% chance per update)
const generateStatus = (currentStatus: DeviceStatus, isStable: boolean): DeviceStatus => {
  // If not stable, more likely to be in active state
  if (!isStable) {
    return Math.random() < 0.9 ? 'active' : currentStatus;
  }
  
  const shouldChange = Math.random() < 0.01; // 1% chance to change
  
  if (!shouldChange) {
    return currentStatus;
  }

  // Weighted status changes (active is most common)
  const rand = Math.random();
  if (rand < 0.7) return 'active';
  if (rand < 0.85) return 'idle';
  if (rand < 0.95) return 'error';
  return 'maintenance';
};

/**
 * Generate realistic Penko 1020 weighing indicator metrics with smooth transitions
 * For offline devices, returns the last active metrics (frozen)
 * For online devices, generates new metrics and updates the last active metrics
 */
export const generateMetrics = (deviceId: string): DeviceMetrics => {
  // Check if device is active
  const isActive = isDeviceActive(deviceId);
  
  // Get previous metrics or initialize
  const previousMetrics = metricsState.get(deviceId) || initializeMetrics(deviceId);
  
  // If device is not active (idle/offline/error/maintenance), return frozen/null metrics
  if (!isActive) {
    const frozen = lastActiveMetrics.get(deviceId);
    if (frozen) {
      // Update timestamp but keep all other values the same
      return {
        ...frozen,
        timestamp: new Date(),
      };
    }
    // If no last active metrics stored yet, store current and return it
    lastActiveMetrics.set(deviceId, previousMetrics);
    return previousMetrics;
  }
  
  // Device is active - generate new metrics
  const newNetWeight = generateNetWeight(previousMetrics.netWeight, deviceId);
  const newTareWeight = generateTareWeight(previousMetrics.tareWeight);
  const newGrossWeight = Number((newNetWeight + newTareWeight).toFixed(2));
  const isStable = generateStability(previousMetrics.netWeight, newNetWeight);
  
  const newMetrics: DeviceMetrics = {
    deviceId,
    timestamp: new Date(),
    grossWeight: newGrossWeight,
    tareWeight: newTareWeight,
    netWeight: newNetWeight,
    isStable,
    loadCellCount: previousMetrics.loadCellCount,
    measuringSpeed: 1600,
    status: generateStatus(previousMetrics.status, isStable),
    temperature: generateTemperature(previousMetrics.temperature),
    // Legacy fields for compatibility
    weight: newNetWeight,
    batteryLevel: previousMetrics.batteryLevel,
    humidity: previousMetrics.humidity,
  };

  // Store for next iteration
  metricsState.set(deviceId, newMetrics);
  // Store as last active metrics
  lastActiveMetrics.set(deviceId, newMetrics);

  return newMetrics;
};

/**
 * Generate historical metrics for a device
 * Used for the GET /api/devices/:id/metrics endpoint
 */
export const generateHistoricalMetrics = (
  deviceId: string,
  count: number = 50
): DeviceMetrics[] => {
  const metrics: DeviceMetrics[] = [];
  const now = Date.now();

  // Generate metrics going back in time (5-second intervals)
  for (let i = count - 1; i >= 0; i--) {
    const timestamp = new Date(now - i * 5000); // 5 seconds apart
    const metric = generateMetrics(deviceId);
    metrics.push({
      ...metric,
      timestamp,
    });
  }

  return metrics;
};

/**
 * Reset metrics state (useful for testing)
 */
export const resetMetricsState = (): void => {
  metricsState.clear();
  lastActiveMetrics.clear();
};
