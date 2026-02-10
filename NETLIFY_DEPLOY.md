# Netlify Deployment Guide

## Mock Service Worker as Netlify Functions

This project uses Netlify Functions to serve as the mock API backend when deployed to Netlify.

## Files Created

- `netlify/functions/auth.ts` - Authentication endpoints (/api/auth/login, /api/auth/logout)
- `netlify/functions/devices.ts` - Device endpoints (/api/devices, /api/devices/:id, /api/devices/:id/metrics)
- `netlify/functions/websocket.ts` - WebSocket endpoint (/api/websocket)
- `netlify.toml` - Netlify configuration with redirect rules

## Development

### Run with Netlify Functions locally:

```bash
npm run dev:netlify
```

This starts the Vite dev server along with the Netlify Functions at `http://localhost:8888`.

The API will be available at:
- `http://localhost:5173/api/devices`
- `http://localhost:5173/api/auth/login`
- `http://localhost:8888/.netlify/functions/devices`

### Production Deployment

The GitHub Action workflow (`.github/workflows/deploy.yml`) automatically:
1. Installs dependencies
2. Builds the React app
3. Deploys both the app and functions to Netlify

## Environment Variables

Add these to Netlify dashboard (Site settings > Environment variables):

| Variable | Value |
|----------|-------|
| `VITE_API_BASE_URL` | `/api` |
| `VITE_WS_URL` | `wss://your-site.netlify.app/.netlify/functions/websocket` |

## API Endpoints

### Authentication
- `POST /api/auth/login` - Returns JWT token
- `POST /api/auth/logout` - Returns success message

### Devices
- `GET /api/devices` - Returns all devices
- `GET /api/devices/:id` - Returns single device
- `GET /api/devices/:id/metrics?limit=50` - Returns device metrics

### WebSocket
- `GET /api/websocket` - Returns current metrics for all devices

## Credentials

- Username: `admin`
- Password: `admin`
