const CACHE_NAME = 'my-pwa-cache-v1.1.0';
const FILES_TO_CACHE = ['/', '/manifest.webmanifest', '/download/ffmpeg-core.js', '/download/ffmpeg-core.wasm', '/download/ffmpeg-core.worker.js'];

// Install: cache all static assets
self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE)));
    self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            )
        )
    );
    self.clients.claim();
});

// Fetch: serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(caches.match(event.request).then((response) => response || fetch(event.request)));
});
