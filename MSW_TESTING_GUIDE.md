# MSW Backend Agent - Quick Start Guide

## Testing the MSW Setup

### 1. Start Development Server
```bash
cd /Users/ashishsantikari/Documents/git/work/yourbrand-platform
npm run dev
```

### 2. Test Authentication in Browser Console

Open browser console and run:

```javascript
// Test successful login
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'admin' })
})
  .then(r => r.json())
  .then(data => {
    console.log('✅ Login successful:', data);
    localStorage.setItem('authToken', data.token);
  });

// Test failed login
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'wrong', password: 'wrong' })
})
  .then(r => r.json())
  .then(data => console.log('❌ Login failed:', data));
```

### 3. Test Device API

```javascript
// Get all devices (should return 10)
fetch('/api/devices')
  .then(r => r.json())
  .then(devices => {
    console.log(`✅ Found ${devices.length} devices:`, devices);
  });

// Get single device
fetch('/api/devices/PENKO-1020-001')
  .then(r => r.json())
  .then(device => console.log('✅ Device details:', device));

// Get device metrics
fetch('/api/devices/PENKO-1020-001/metrics?limit=20')
  .then(r => r.json())
  .then(metrics => console.log(`✅ Found ${metrics.length} metrics:`, metrics));
```

### 4. Test WebSocket Streaming

```javascript
// Connect to WebSocket
const ws = new WebSocket('ws://localhost:5173/ws');

ws.onopen = () => {
  console.log('✅ WebSocket connected');
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log(`📊 Metrics from ${message.deviceId}:`, message.data);
};

ws.onerror = (error) => {
  console.error('❌ WebSocket error:', error);
};

ws.onclose = () => {
  console.log('🔌 WebSocket disconnected');
};

// To close the connection:
// ws.close();
```

### 5. Monitor Real-Time Updates

Keep the console open and watch for:
- All 10 devices streaming every 300ms
- Smooth value transitions (no jumpy changes)
- Occasional status changes
- Realistic metrics values

### 6. Test Reconnection

```javascript
// Close and reopen to test reconnection
ws.close();

setTimeout(() => {
  const newWs = new WebSocket('ws://localhost:5173/ws');
  newWs.onmessage = (event) => {
    console.log('🔄 Reconnected:', JSON.parse(event.data));
  };
}, 2000);
```

## Expected Behavior

### Authentication
- ✅ Login with `admin/admin` returns token and user object
- ❌ Invalid credentials return 401 error

### Device API
- ✅ GET /api/devices returns 10 devices sorted by ID
- ✅ GET /api/devices/:id returns single device
- ❌ Invalid device ID returns 404
- ✅ GET /api/devices/:id/metrics returns historical data

### WebSocket
- ✅ Connects immediately
- ✅ Starts streaming all 10 devices
- ✅ Updates every 300ms (3.33 updates per second per device)
- ✅ Smooth metric transitions
- ✅ Clean disconnection
- ✅ Supports reconnection

## Device List Reference

| Device ID | Name | Location | Status | Connection |
|-----------|------|----------|--------|------------|
| PENKO-1020-001 | Scale A1 | Warehouse A | Active | Connected |
| PENKO-1020-002 | Scale A2 | Warehouse A | Active | Connected |
| PENKO-1020-003 | Scale A3 | Warehouse B | Active | Connected |
| PENKO-1020-004 | Scale A4 | Warehouse B | Active | Connected |
| PENKO-1020-005 | Scale A5 | Warehouse C | Active | Connected |
| PENKO-1020-006 | Scale A6 | Production Line 1 | Active | Connected |
| PENKO-1020-007 | Scale A7 | Production Line 1 | Idle | Connected |
| PENKO-1020-008 | Scale A8 | Production Line 2 | Idle | Connected |
| PENKO-1020-009 | Scale A9 | Storage Facility | Error | Disconnected |
| PENKO-1020-010 | Scale A10 | Quality Control | Maintenance | Error |

## Metrics Reference

Each device streams these metrics:
- **weight**: 0-500 kg (changes by ±5kg max)
- **temperature**: 18-28°C (changes by ±0.5°C max)
- **status**: active, idle, error, maintenance (changes rarely, 5% chance)
- **batteryLevel**: 50-100% (changes by ±2% max)
- **humidity**: 40-70% (changes by ±2% max)

## Troubleshooting

### MSW not starting
- Check browser console for "[MSW] Mock Service Worker started"
- Verify `public/mockServiceWorker.js` exists
- Ensure you're in development mode (`npm run dev`)

### WebSocket not connecting
- Check the URL is `ws://localhost:5173/ws`
- Verify MSW is running
- Check browser console for connection errors

### No data streaming
- Open browser console and watch for messages
- Verify WebSocket is connected (`ws.readyState === 1`)
- Check for JavaScript errors

### Type errors
- Run `npm run build` to check for TypeScript errors
- Ensure all type files in `src/types/` are present

## Performance Metrics

- **Devices**: 10
- **Update Frequency**: 300ms
- **Messages/Second**: ~33 (10 devices × 3.33 updates/sec)
- **Message Size**: ~250 bytes per message
- **Bandwidth**: ~8 KB/sec (very light)

This is lightweight enough for smooth real-time visualization!

---

**MSW Setup Status**: ✅ **100% Complete and Working**
