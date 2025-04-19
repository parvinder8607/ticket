const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './assets/images/alert.png',
  './assets/images/bottom.svg',
  './assets/images/logo.avif',
  './assets/images/qr.png',
  './assets/index-Dyyvgbgj.js',
  './assets/index-DzoiQYD8.css',
  './manifest.json',
];

// Install Service Worker and Cache Files
self.addEventListener('install', event => {
    self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching assets...');
      return cache.addAll(urlsToCache);
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
