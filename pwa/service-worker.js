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
  console.log('fetch: calling dynamicCache...');
  event.respondWith(dynamicCache(event.request));
});

self.addEventListener('sync', event => {
  if (event.tag === SYNC) {
    console.log('sync: background syncing...');
    event.waitUntil(Promise.resolve);
  }
});