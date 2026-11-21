/* Service worker template.
 * The `offlineServiceWorker` plugin in vite.config.js fills in VERSION and
 * PRECACHE below with the current build's version and file list.
 * Do not register this file directly; the built file is /service-worker.js.
 */
const VERSION = "2c44ee2c19c6";
const PRECACHE = [
  "./",
  "./index.html",
  "./assets/alfa-slab-one-latin-400-normal-CbTZiZTW.woff2",
  "./assets/images/alert.png",
  "./assets/images/bottom.svg",
  "./assets/images/invalid.jpg",
  "./assets/images/logo.avif",
  "./assets/images/metro.jpeg",
  "./assets/images/qr.png",
  "./assets/images/reload.png",
  "./assets/images/secure.png",
  "./assets/index-B-bo5fLd.css",
  "./assets/index-DFxJkDnd.js",
  "./assets/inter-latin-400-normal-C38fXH4l.woff2",
  "./assets/inter-latin-500-normal-Cerq10X2.woff2",
  "./assets/inter-latin-600-normal-LgqL8muc.woff2",
  "./assets/inter-latin-700-normal-Yt3aPRUw.woff2",
  "./assets/inter-latin-ext-400-normal-C1nco2VV.woff2",
  "./assets/inter-latin-ext-600-normal-D2bJ5OIk.woff2",
  "./assets/inter-latin-ext-700-normal-Ca8adRJv.woff2",
  "./assets/location-DKhDgFEo.svg",
  "./assets/logo/logo.png",
  "./assets/mulish-latin-400-normal-C9Snyl1s.woff2",
  "./assets/mulish-latin-600-normal-BSghSUeJ.woff2",
  "./assets/mulish-latin-700-normal-DP36JSCV.woff2",
  "./assets/qr-scanner-worker.min-D85Z9gVD.js",
  "./assets/roboto-latin-400-normal-BqEyEoaF.woff2",
  "./assets/roboto-latin-500-normal-7RbcRiD8.woff2",
  "./icons/apple-touch-icon.png",
  "./icons/favicon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./manifest.json",
  "./vite.svg"
];

const APP_CACHE = `app-${VERSION}`;
const RUNTIME_CACHE = 'runtime-v1';
const SHELL_URL = new URL('./index.html', self.registration.scope).href;

// Install: download every file the app needs, so it works fully offline.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(APP_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate: remove caches from older builds and take control straight away.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== APP_CACHE && key !== RUNTIME_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // leave other sites alone

  // Page loads: the app uses a hash router, so every page is index.html.
  // Serve it from cache (instant, works offline); fall back to network.
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(SHELL_URL).then((cached) => cached || fetch(request))
    );
    return;
  }

  // Everything else: cache first, then network (saving new files for next time).
  event.respondWith(
    // ignoreVary: some hosts send `Vary: Origin`, which would make font
    // requests (sent with an Origin header) miss the precached copies.
    caches.match(request, { ignoreVary: true }).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          if (response.ok && response.type === 'basic') {
            const copy = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
    )
  );
});
