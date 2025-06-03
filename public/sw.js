const CACHE_NAME = 'my-pwa-cache-v1.1.1';

// Only cache essential static assets
const FILES_TO_CACHE = ['/manifest.webmanifest', '/download/ffmpeg-core.js', '/download/ffmpeg-core.wasm', '/download/ffmpeg-core.worker.js'];

// Install: Cache essential static assets
self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE)));
    self.skipWaiting();
});

// Activate: Clean up outdated caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            )
        )
    );
    self.clients.claim();
});

// Fetch: Serve from cache when appropriate, fallback to network
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    // 1. Only handle same-origin GET requests
    if (request.method !== 'GET' || url.origin !== self.location.origin) {
        return;
    }

    // 2. Bypass caching for dynamic/streaming/data routes
    if (url.pathname === '/' || url.pathname.endsWith('.rsc') || url.pathname.startsWith('/_next/data/') || url.pathname.startsWith('/api/')) {
        return; // Let browser handle it directly
    }

    // 3. Try to serve from cache first, then fetch and cache new response
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(request)
                .then((networkResponse) => {
                    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                        return networkResponse;
                    }

                    // Clone response and store in cache
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });

                    return networkResponse;
                })
                .catch(() => {
                    // Optional: handle offline fallback here
                    // e.g., return caches.match('/offline.html');
                    return new Response('You are offline and this resource is not cached.', {
                        status: 503,
                        headers: { 'Content-Type': 'text/plain' },
                    });
                });
        })
    );
});
