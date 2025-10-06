const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
  './ticket/',
  './ticket/index.html',
  './ticket/assets/images/alert.png',
  './ticket/assets/images/bottom.svg',
  './ticket/assets/images/logo.avif',
  './ticket/assets/images/metro.jpeg',
  './ticket/assets/images/qr.png',
  './ticket/assets/images/secure.png',
  './ticket/logo/logo.png',
  './ticket/assets/index-Cwbdo9lj.js',
  './ticket/assets/index-DzoiQYD8.css',
  './ticket/manifest.json',
];

// Install Service Worker and Cache Files
self.addEventListener('install', event => {
    self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching assets...');
       return cache.addAll(urlsToCache).catch(error => {
        console.error('Failed to cache assets:', error);
      });
    })
  );
});

// Fetch Cached Resources When Offline
self.addEventListener('fetch', event => {
    clients.claim();
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then(response => response || caches.match('/'))
    )
  );
});

// Cleanup Old Caches on Activation
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(cacheNames.filter(cache => cache !== CACHE_NAME).map(cache => caches.delete(cache)))
    )
  );
});


