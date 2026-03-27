// Service Worker para Mordomo Fiel
// Este arquivo foi gerado automaticamente pelo sistema de branding

const CACHE_NAME = 'mordomo-fiel-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/App.css',
  '/src/index.css',
  'https://rtqfkvytdprwoqdzkweh.supabase.co/storage/v1/object/public/uploads/logos/1755809337161-hmu8jdaphrl.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

console.log('Service Worker ativo para Mordomo Fiel');
