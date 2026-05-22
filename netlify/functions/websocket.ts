import type { Handler, HandlerEvent } from '@netlify/functions';

interface DeviceMetric {
  deviceId: string;
  timestamp: string;
  grossWeight: number;
  tareWeight: number;
  netWeight: number;
  status: string;
  isStable: boolean;
  loadCellCount: number;
  measuringSpeed: number;
  temperature: number;
  weight: number;
  batteryLevel: number;
  humidity: number;
}

const deviceIds = Array.from({ length: 10 }, (_, i) => {
  const num = String(i + 1).padStart(3, '0');
  return `PENKO-1020-${num}`;
});

const deviceStatuses = ['active', 'active', 'active', 'active', 'active', 'active', 'idle', 'idle', 'error', 'maintenance'];

const metricsState = new Map<string, DeviceMetric>();

function generateMetrics(deviceId: string, index: number): DeviceMetric {
  const deviceNum = index + 1;
  const tareWeight = 20 + deviceNum * 5;
  const baseNetWeight = 100 + deviceNum * 50;
  const baseTemp = 20 + (deviceNum % 5) * 0.5;

  const previous = metricsState.get(deviceId);
  let netWeight: number;
  if (previous) {
    const rand = Math.random();
    let change: number;
    if (rand < 0.6) change = (Math.random() - 0.5) * 2;
    else if (rand < 0.85) change = (Math.random() - 0.5) * 20;
    else if (rand < 0.95) change = (Math.random() - 0.5) * 60;
    else change = (Math.random() - 0.5) * 200;
    netWeight = previous.netWeight + change;
    netWeight = Math.max(0, Math.min(baseNetWeight + 300, Number(netWeight.toFixed(2))));
  } else {
    netWeight = baseNetWeight + (Math.random() * 20 - 10);
  }

  const newTareWeight = Math.random() < 0.99
    ? (previous?.tareWeight ?? tareWeight)
    : Math.max(10, Math.min(100, (previous?.tareWeight ?? tareWeight) + (Math.random() - 0.5) * 1));
  const grossWeight = Number((netWeight + newTareWeight).toFixed(2));
  const isStable = previous ? Math.abs(netWeight - previous.netWeight) < 0.5 : true;
  const temperature = Number((baseTemp + (Math.random() * 2 - 1)).toFixed(1));

  const metric: DeviceMetric = {
    deviceId,
    timestamp: new Date().toISOString(),
    grossWeight,
    tareWeight: Number(newTareWeight.toFixed(2)),
    netWeight,
    status: deviceStatuses[index],
    isStable,
    loadCellCount: Math.min((deviceNum % 4) + 1, 8),
    measuringSpeed: 1600,
    temperature,
    weight: netWeight,
    batteryLevel: Number((80 + Math.random() * 20).toFixed(1)),
    humidity: Number((45 + Math.random() * 10).toFixed(1)),
  };

  metricsState.set(deviceId, metric);
  return metric;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

const handler: Handler = (event: HandlerEvent) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: '',
    };
  }

  const path = event.path.replace(/\/.netlify\/functions\//, '');

  if (path === 'websocket' && event.httpMethod === 'GET') {
    const metrics = deviceIds.map((deviceId, index) => {
      const metric = generateMetrics(deviceId, index);
      return {
        type: 'metrics',
        deviceId: metric.deviceId,
        timestamp: metric.timestamp,
        data: metric,
      };
    });

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
