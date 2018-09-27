const CACHE = 'todo-static-cache';
const ASSETS = [
    '/',
    'index.html',
    'style.css',
    'w3c.4.10.css',
    'favicon.ico',
    'logo.png',
    'logo-96.png',
    'logo-128.png',
    'logo-170.png',
    'logo-192.png',
    'logo-256.png',
    'logo-341.png',
    'logo-384.png',
    'logo-512.png',
    'index.js',
    'service-worker-registrar.js',
    'service-worker.js',
    'todo-service.js',
    'todo-model-view.js'
];
const SYNC = 'todo-sync';

function toStaticCache() {
    return caches.open(CACHE).then(cache => {
        console.log('toStaticCache: caching assets...');
        return cache.addAll(ASSETS);
    });
}

function fromStaticCache(request) {
    return caches.match(request).then(matching => {
        if (matching) {
            console.log('fromStaticCache: matched request.', request.url);
            return matching;
        } else {
            console.log('fromStaticCache: match failed.', request.url);
            return Promise.reject;
        }
    });
}

function invalidateStaticCache() {
    caches.delete(CACHE).then(invalidatedCache => console.log('invalidateCache: Invalidated cache?', invalidatedCache));
    toStaticCache();
}

self.addEventListener('install', event => {
    console.log('install: service worker installed.', event);
    event.waitUntil(toStaticCache());
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
    console.log('fetch: calling fromStaticCache...');
    event.respondWith(fromStaticCache(event.request).then(response => {
        return response || fetch(event.request);
    }));
});

self.addEventListener('sync', event => {
    if (event.tag === SYNC) {
        console.log('sync: background syncing...', event);
        event.waitUntil(Promise.resolve());
    }
});