import { http, HttpResponse } from 'msw';
import { mockDevices, findDeviceById } from '../data/mockDevices';
import { generateHistoricalMetrics } from '../data/mockMetrics';

export const deviceHandlers = [
  // GET /api/devices - List all devices
  http.get('/api/devices', () => {
    // Sort devices by ID (alphanumeric)
    const sortedDevices = [...mockDevices].sort((a, b) => 
      a.id.localeCompare(b.id)
    );

    return HttpResponse.json(sortedDevices, { status: 200 });
  }),

  // GET /api/devices/:id - Get single device
  http.get('/api/devices/:id', ({ params }) => {
    const { id } = params;
    const device = findDeviceById(id as string);

    if (!device) {
      return HttpResponse.json(
        { error: `Device with ID ${id} not found` },
        { status: 404 }
      );
    }

    return HttpResponse.json(device, { status: 200 });
  }),

  // GET /api/devices/:id/metrics - Get device metrics (historical)
  http.get('/api/devices/:id/metrics', ({ params, request }) => {
    const { id } = params;
    const device = findDeviceById(id as string);

    if (!device) {
      return HttpResponse.json(
        { error: `Device with ID ${id} not found` },
        { status: 404 }
      );
    }

    // Parse query parameters for pagination/limit
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);

    const metrics = generateHistoricalMetrics(id as string, limit);

    return HttpResponse.json(metrics, { status: 200 });
  }),
];
