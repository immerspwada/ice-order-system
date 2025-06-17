const CACHE_NAME = 'lucky-delivery-cache-v1';
const urlsToCache = [
  'index.html',
  'form.html',
  'summary.html',
  'receipt.html',
  'admin.html',
  'style.css',
  'order.js',
  'form.js',
  'summary.js',
  'receipt.js',
  'admin.js',
  'products.json',
  'config.js',
  'manifest.json',
  'icon-192x192.png',
  'icon-512x512.png',
  'https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;700&display=swap',
  'https://static.line-scdn.net/liff/edge/2/sdk.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
