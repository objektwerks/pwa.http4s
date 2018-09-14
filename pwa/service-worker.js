importScripts('./cache.js');

self.addEventListener('install', event => {
  console.log('install: service worker installed.', event);
  event.waitUntil(preCache());
});

self.addEventListener('activate', event => {
  console.log('activate: service worker activated.', event);
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
    console.warn('fetch: Bug [823392] cache === only-if-cached && mode !== same-orgin', event.request);
    return;
  }
  console.log('fetch: calling fromCache...');
  event.respondWith(fromCache(event.request).then(response => {
    return response || fetch(event.request);
  }));
});

self.addEventListener('sync', event => {
  if (event.tag === SYNC) {
    console.log('sync: background syncing...', event);
    event.waitUntil(Promise.resolve);
  }
});

self.addEventListener('message', event => {
  console.log('message: received...', event);
});