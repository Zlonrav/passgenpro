const CACHE_NAME = 'gen-v1.500'; // ← версия поднята
const ASSETS = [
  './',
  'index.html',
  'readme.html',
  'prophecy.html',     
  'style.css',
  'main.js',
  'easter.js',
  'hashmaster.css',
  'hashmaster.js',
  'manifest.json',
  'favicon.png',
  'favicon_prophecy.png', 
  'icon-192.png',
  'robots.txt',         
  'sitemap.xml'         
];


// Установка и кеширование
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    .then(() => self.skipWaiting())
  );
});

// Активация и удаление старого кеша
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    )).then(() => self.clients.claim())
  );
});

// Стратегия: Сначала Кеш, если нет — Сеть
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
