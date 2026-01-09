export const DeviceStatus = {
  ACTIVE: 'active',
  IDLE: 'idle',
  ERROR: 'error',
  MAINTENANCE: 'maintenance',
} as const;

export type DeviceStatus = typeof DeviceStatus[keyof typeof DeviceStatus];

export const ConnectionStatus = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  ERROR: 'error',
  CONNECTING: 'connecting',
} as const;

export type ConnectionStatus = typeof ConnectionStatus[keyof typeof ConnectionStatus];

export interface Device {
  id: string;
  name: string;
  type: string;
  location?: string;
  status: DeviceStatus;
  lastUpdate: Date;
  connectionStatus: ConnectionStatus;
  statusPercentage?: number; // 0-100, represents device efficiency/performance
}

// Penko 1020 specific metrics for weighing indicators
export interface DeviceMetrics {
  deviceId: string;
  timestamp: Date;
  
  // Weight measurements (primary function of Penko 1020)
  grossWeight: number;      // Total weight including tare (kg)
  tareWeight: number;       // Weight of container/platform (kg)
  netWeight: number;        // Actual product weight = gross - tare (kg)
  
  // Device status
  status: DeviceStatus;
  isStable: boolean;        // Weight reading is stable/settled
  
  // Load cell information
  loadCellCount: number;    // Number of active load cells (max 8)
  measuringSpeed: number;   // Samples per second (max 1600)
  
  // Environmental (optional, if available)
  temperature?: number;     // °C (if temperature sensor present)
  
  // Legacy fields for backward compatibility
  weight?: number;          // Alias for netWeight
  batteryLevel?: number;    // For portable models
  humidity?: number;        // For environmental monitoring
}
