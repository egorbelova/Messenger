const CACHE_NAME = 'video-chunks-cache-v1';

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  if (!url.includes('/videos/')) return;

  event.respondWith(handleVideoRequest(event.request));
});

async function handleVideoRequest(request) {
  const cache = await caches.open(CACHE_NAME);

  const range = request.headers.get('Range');

  if (!range) {
    const cached = await cache.match(request);
    if (cached) return cached;

    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  }

  let response = await fetch(request);

  const size = parseInt(response.headers.get('Content-Length') || '0', 10);
  if (size > 50_000) {
    cache.put(request, response.clone());
  }

  return response;
}

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  clients.claim();
});
