# Netlify Deployment Guide

This project uses Netlify Functions as the mock API backend.

## Architecture

### API Endpoints (REST)
- `POST /api/auth/login` — Authentication
- `POST /api/auth/logout` — Logout
- `GET /api/devices` — List all devices
- `GET /api/devices/:id` — Get single device
- `GET /api/devices/:id/metrics` — Get device historical metrics

### Realtime Metrics (Polling)
- `GET /api/websocket` — Returns current metrics for all 10 devices as JSON

The client polls this endpoint every 1 second. The function executes only when polled (~50ms per call), keeping costs well within Netlify's free tier.

### Client-Side Realtime Layer

The app uses a unified realtime client abstraction:
- **Dev (MSW):** Real WebSocket via MSW service worker (`ws://localhost:5173/ws`)
- **Production (Netlify):** HTTP polling via `fetch` to `/api/websocket`

The `WebSocketManager` auto-selects the implementation based on whether `VITE_WS_URL` uses a `ws://`/`wss://` prefix (WebSocket) or an HTTP path (polling).

## Files

- `netlify/functions/auth.ts` — Auth endpoints
- `netlify/functions/devices.ts` — Device REST endpoints
- `netlify/functions/websocket.ts` — Metrics polling endpoint
- `netlify.toml` — Netlify configuration with redirect rules

## Development

### Run with Netlify Functions locally:
```bash
npm run dev:netlify
```
This starts the Vite dev server along with the Netlify Functions at `http://localhost:8888`.

### Run with MSW (no Netlify Functions):
```bash
npm run dev
```

## Production Deployment

The GitHub Action workflow (`.github/workflows/deploy.yml`) automatically:
1. Installs dependencies
2. Builds the React app
3. Deploys both the app and functions to Netlify

## Environment Variables

Add these to Netlify dashboard (Site settings > Environment variables):

| Variable | Value | Notes |
|----------|-------|-------|
| `VITE_API_BASE_URL` | `/api` | API base path |
| `VITE_WS_URL` | `/api/websocket` | Polling endpoint (no `ws://` prefix → uses polling mode) |

For local dev, set `VITE_WS_URL=ws://localhost:5173/ws` to use MSW WebSocket.

## Cost (Netlify Free Tier)

With 1-second polling, per user at 8h/day:

| Metric | Monthly | Credits |
|--------|---------|---------|
| Web requests | ~864K | ~173 |
| Compute (~50ms × 864K) | ~0.003 GB-h | ~0.03 |
| **Total** | | **~173** |

The free tier provides **300 credits/month**, fitting comfortably for demo usage.

## Credentials

- Username: `admin`
- Password: `admin`
