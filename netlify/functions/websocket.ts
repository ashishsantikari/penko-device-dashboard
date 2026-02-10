import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

interface DeviceMetric {
  deviceId: string;
  timestamp: string;
  value: number;
  status: string;
  unit: string;
}

const deviceStatuses = ['active', 'active', 'active', 'active', 'active', 'active', 'idle', 'idle', 'error', 'maintenance'];
const statusPercentages = [95, 92, 88, 97, 93, 89, 68, 72, 15, 0];

const generateMetrics = (): DeviceMetric[] => {
  return Array.from({ length: 10 }, (_, index) => {
    const deviceNumber = String(index + 1).padStart(3, '0');
    const baseValue = 100 + Math.random() * 50;
    const variance = (Math.random() - 0.5) * 10;

    return {
      deviceId: `PENKO-1020-${deviceNumber}`,
      timestamp: new Date().toISOString(),
      value: Number((baseValue + variance).toFixed(2)),
      status: deviceStatuses[index],
      unit: 'kg',
    };
  });
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

  if (path === 'websocket' && event.httpMethod === 'GET') {
    const metrics = generateMetrics();
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
