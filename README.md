# Industrial IoT Dashboard - Penko 1020 Integration

## Project Overview

This project is a **freelance Proof of Concept (POC)** developed for an industrial manufacturer to integrate and manage **Penko 1020** weighing indicators using Programmable Logic Controllers (PLCs).

### The Challenge

Industrial weighing systems traditionally require Windows PC executables to monitor and control Penko 1020 devices. This approach has several drawbacks:
- Requires dedicated Windows machines on the factory floor
- Limited accessibility - users must be physically near the workstation
- Outdated user interfaces that don't leverage modern web technologies
- Difficult to scale and maintain across multiple production lines

### The Solution

A modern **browser-based dashboard** that replaces traditional Windows applications, providing:
- Real-time monitoring of Penko 1020 devices from any modern web browser
- WebSocket-based streaming for instant data updates
- Unified interface for managing multiple weighing stations
- Platform-independent access (works on Windows, macOS, Linux)

### Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Penko 1020     │     │  Penko 1020     │     │  Penko 1020     │
│  Weighing        │     │  Weighing       │     │  Weighing       │
│  Indicator      │     │  Indicator      │     │  Indicator      │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                      │                      │
         └──────────────────────┼──────────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │    Industrial        │
                    │    Switch / PLC      │
                    │    (Solo Ethernet    │
                    │    Protocol)         │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │      Node-RED        │
                    │   (Hardware Bridge)  │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │   WebSocket Server   │
                    │   (Real-time Data)   │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │  React Dashboard      │
                    │  (Browser-based UI)  │
                    └─────────────────────┘
```

### Technology Stack

**Backend Integration Layer:**
- **Node-RED** - Low-code programming for connecting PLCs and industrial devices using Solo Ethernet protocol
- Handles hardware communication and protocol conversion
- Provides WebSocket endpoint for real-time data streaming

**Frontend Dashboard:**
- **React 19.2** - Modern UI library
- **TypeScript 5.7** - Type-safe development
- **Vite 7.2** - Fast build tool
- **TanStack Query v5** - Data fetching and caching
- **WebSocket** - Real-time device metrics streaming
- **Wouter 3.9** - Lightweight routing
- **@dnd-kit** - Drag-and-drop interface
- **shadcn/ui** - Professional UI component library
- **react-i18next** - Multi-language support (EN/DE)
- **MSW 2.12** - API mocking for development

### Key Features

- **Real-time Monitoring** - Live weight readings from Penko 1020 devices at 300ms intervals
- **Multi-Device Support** - Monitor up to 10+ weighing stations simultaneously
- **Responsive Design** - Works on desktop and tablet devices
- **Drag & Drop** - Customizable dashboard layout
- **Internationalization** - English and German language support
- **Historical Data** - Unlimited data retention for analysis
- **Device Status** - Online/Offline/Stable/Error indicators

### Why This Approach?

**Industry Preference for Browser-Based Solutions:**
- No software installation required on user machines
- Cross-platform compatibility (Windows, macOS, Linux)
- Centralized updates and maintenance
- Better security model through standard web practices
- Lower total cost of ownership
- Familiar interface for modern users

### Node-RED Integration

Node-RED serves as the bridge between industrial hardware and the web dashboard:

```yaml
# Node-RED Flow Concept
[Penko Device] → [TCP/IP Node] → [Function Node] → [WebSocket Out]
                    ↓
            [Parse Weight Data]
                    ↓
            [Calculate Net/Gross]
                    ↓
            [Format for Dashboard]
```

---

## Application Features

Real-time industrial scale monitoring dashboard built with React, TypeScript, and Vite.

## Features

- **Authentication System**: Secure login with JWT tokens (admin/admin)
- **Real-time Updates**: WebSocket streaming at 300ms intervals
- **Device Management**: Monitor 10 industrial scale devices
- **Drag & Drop**: Reorderable device cards and tables
- **Dual Views**: Grid and table view with separate ordering per user
- **Internationalization**: English and German translations
- **Unlimited Cache**: React Query with infinite data retention
- **Mock Service Worker**: Complete MSW setup for development

## Tech Stack

- **React 19.2** with TypeScript
- **Vite 7.2** for blazing fast builds
- **TanStack Query v5** (React Query) with unlimited cache
- **Wouter 3.9** for routing
- **@dnd-kit** for drag and drop
- **shadcn/ui** with black & white theme (Tailwind CSS)
- **react-i18next** for EN/DE translations
- **MSW 2.12** for API mocking
- **Vitest** for testing

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will start at `http://localhost:5173`

### Login Credentials

- **Username**: admin
- **Password**: admin

### Building

```bash
npm run build
```

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Type Checking

```bash
npm run type-check
```

## Project Structure

```
src/
├── assets/          # Static assets and translations
│   └── locales/     # EN/DE translation files
├── components/      # React components
│   ├── ui/          # shadcn/ui components
│   ├── auth/        # Authentication components
│   ├── layout/      # Layout components (Header, Sidebar)
│   └── devices/     # Device-related components
├── hooks/           # Custom React hooks
├── lib/             # Utility libraries
│   ├── api/         # API client
│   ├── websocket/   # WebSocket client and manager
│   └── utils/       # Helper functions
├── mocks/           # MSW mock handlers
│   ├── handlers/    # API and WebSocket handlers
│   └── data/        # Mock data
├── pages/           # Page components
├── providers/       # React context providers
├── services/        # Business logic services
└── types/           # TypeScript type definitions
```

## Key Features Explained

### Unlimited Cache

React Query is configured with unlimited cache retention:

```typescript
gcTime: Infinity    // Never garbage collect
staleTime: Infinity // Never mark as stale
```

All device data and metrics are stored indefinitely for historical analysis.

### Drag & Drop

- **Grid View**: Hover-based drag handle
- **Table View**: Always-visible drag handle
- Order persists per user and per view in localStorage

### WebSocket Integration

Real-time device metrics stream via WebSocket at 300ms intervals. The WebSocket client automatically:
- Reconnects on connection loss
- Updates React Query cache
- Handles device status changes

### Internationalization

Language switcher in header switches between English and German. All UI text is translated.

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_API_BASE_URL=/api
VITE_WS_URL=ws://localhost:8080
```

## MSW Integration

Mock Service Worker is automatically started in development mode. It provides:
- Authentication API (`/api/auth/login`)
- Device API (`/api/devices`)
- WebSocket server (`ws://localhost:8080`)

## Testing

The project uses Vitest and React Testing Library. MSW is integrated for API mocking in tests.

## Contributing

This project follows TypeScript strict mode and uses ESLint for code quality.

## License

MIT
