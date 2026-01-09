import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Setup MSW worker with all handlers
export const worker = setupWorker(...handlers);

// Enable MSW in development mode
export const startMockServiceWorker = async () => {
  if (import.meta.env.DEV) {
    await worker.start({
      onUnhandledRequest: 'warn',
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    });
    console.log('[MSW] Mock Service Worker started');
    console.log('[MSW] Mocking 10 devices with 300ms WebSocket streaming');
  }
};
