const CACHE = 'todo-cache';
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

function toCache() {
    return caches.open(CACHE).then(cache => {
        console.log('toCache: caching assets...');
        return cache.addAll(ASSETS);
    });
}

function fromCache(request) {
    return caches.match(request).then(matching => {
        if (matching) {
            console.log('fromCache: matched request.', request.url);
            return matching;
        } else {
            return Promise.reject("cache match failed");
        }
    });
}

function invalidateCache() {
    caches.delete(CACHE).then(invalidatedCache => {
        console.log('invalidateCache: cache invalidated?', invalidatedCache);
        if (invalidatedCache) toCache();
    })
}

self.addEventListener('install', event => {
    console.log('install: service worker installed.', event);
    event.waitUntil(toCache());
});

self.addEventListener('activate', event => {
    console.log('activate: service worker activated.', event);
    invalidateCache();
    return self.clients.claim();
});

self.addEventListener('fetch', event => {
    if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
        console.warn('fetch: Bug [823392] cache === only-if-cached && mode !== same-orgin', event.request.url);
        return;
    }
    event.respondWith(fromCache(event.request)
        .then(response => {
            console.log('fetch: in cache.', event.request.url);
            return response;
        })
        .catch(_ => {
            console.log('fetch: not in cache, calling server...');
            return fetch(event.request).then(response => {
                return response;
            }).catch(error => console.error('fetch: server call failed!', error));
        })
    );
});

self.addEventListener('sync', event => {
    if (event.tag === SYNC) {
        console.log('sync: background syncing...', event);
        event.waitUntil(Promise.resolve());
    }
});