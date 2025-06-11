import { defaultCache } from '@serwist/next/worker';
import { NetworkOnly, Serwist } from 'serwist';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';

// Declare the precache manifest for TypeScript:
declare global {
    interface WorkerGlobalScope extends SerwistGlobalConfig {
        __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
    }
}

declare const self: ServiceWorkerGlobalScope;

// Initialize Serwist with custom runtimeCaching:
const serwist = new Serwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: [
        {
            // Match requests to /api/saavn/ on the same origin
            matcher: ({ url, sameOrigin }) => sameOrigin && url.pathname.startsWith('/api/saavn/'),
            // Always go to the network (no cache)
            handler: new NetworkOnly(),
        },
        // Spread the defaultCache strategies for all other routes
        ...defaultCache,
    ],
});

serwist.addEventListeners();
