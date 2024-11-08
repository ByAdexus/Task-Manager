const CACHE_NAME = 'app-cache-v1';
const DATA_CACHE_NAME = 'data-cache-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/static/css/main.css',
  '/static/js/main.js',
  // Add other static assets like fonts, icons, etc.
];

// Installing Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(FILES_TO_CACHE); // Cache all static files
      })
  );
});

// Activating Service Worker and cleaning old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME, DATA_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName); // Clean up old caches
          }
        })
      );
    })
  );
});

// Clear all caches on service worker activation
self.addEventListener('message', (event) => {
    if (event.data === 'clearCache') {
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          caches.delete(cacheName); // Delete all caches
        });
      });
      console.log('All caches have been cleared');
    }
  });
  


// Fetching resources from cache (static assets and dynamic data)
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/data/')) {
    // Handle dynamic data caching for tasks, projects, etc.
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) => {
        return fetch(event.request).then((response) => {
          // Cache the response for future use
          cache.put(event.request, response.clone());
          return response;
        }).catch(() => {
          return caches.match(event.request); // Fallback to cache if offline
        });
      })
    );
  } else {
    // Serve static assets
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request); // Serve from cache, otherwise fetch
      })
    );
  }
});
