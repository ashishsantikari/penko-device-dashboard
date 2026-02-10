import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

interface Device {
  id: string;
  name: string;
  type: string;
  location: string;
  status: string;
  lastUpdate: string;
  connectionStatus: string;
  statusPercentage: number;
}

interface Metric {
  timestamp: string;
  value: number;
  unit: string;
}

const deviceStatuses = ['active', 'active', 'active', 'active', 'active', 'active', 'idle', 'idle', 'error', 'maintenance'];
const connectionStatuses = ['connected', 'connected', 'connected', 'connected', 'connected', 'connected', 'connected', 'connected', 'disconnected', 'error'];
const statusPercentages = [95, 92, 88, 97, 93, 89, 68, 72, 15, 0];
const locations = ['Warehouse A', 'Warehouse A', 'Warehouse B', 'Warehouse B', 'Warehouse C', 'Production Line 1', 'Production Line 1', 'Production Line 2', 'Storage Facility', 'Quality Control'];

const generateDevices = (): Device[] => {
  return Array.from({ length: 10 }, (_, index) => {
    const deviceNumber = String(index + 1).padStart(3, '0');
    return {
      id: `PENKO-1020-${deviceNumber}`,
      name: `Scale A${index + 1}`,
      type: 'PENKO-1020',
      location: locations[index],
      status: deviceStatuses[index],
      lastUpdate: new Date().toISOString(),
      connectionStatus: connectionStatuses[index],
      statusPercentage: statusPercentages[index],
    };
  });
};

const generateHistoricalMetrics = (deviceId: string, limit: number): Metric[] => {
  const baseValue = 100 + Math.random() * 50;
  return Array.from({ length: Math.min(limit, 100) }, (_, index) => {
    const variance = (Math.random() - 0.5) * 10;
    return {
      timestamp: new Date(Date.now() - index * 300000).toISOString(),
      value: Number((baseValue + variance).toFixed(2)),
      unit: 'kg',
    };
  });
};

const mockDevices = generateDevices();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  const path = event.path.replace(/\/.netlify\/functions\//, '');

  if (path === 'devices' && event.httpMethod === 'GET') {
    const sortedDevices = [...mockDevices].sort((a, b) => a.id.localeCompare(b.id));
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(sortedDevices),
    };
  }

  const deviceMatch = path.match(/^devices\/(.+)$/);
  if (deviceMatch) {
    const deviceId = deviceMatch[1];
    const device = mockDevices.find(d => d.id === deviceId);

    if (!device) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ error: `Device with ID ${deviceId} not found` }),
      };
    }

    if (event.httpMethod === 'GET') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(device),
      };
    }
  }

  const metricsMatch = path.match(/^devices\/(.+)\/metrics$/);
  if (metricsMatch && event.httpMethod === 'GET') {
    const deviceId = metricsMatch[1];
    const device = mockDevices.find(d => d.id === deviceId);

    if (!device) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ error: `Device with ID ${deviceId} not found` }),
      };
    }

    const url = new URL(event.rawUrl);
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const metrics = generateHistoricalMetrics(deviceId, limit);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(metrics),
    };
  }

  return {
    statusCode: 404,
    headers: corsHeaders,
    body: JSON.stringify({ error: 'Not found' }),
  };
};

export { handler };
