const CACHE = 'pwa-cache';
const ASSETS = [
    'index.html',
    'offline.html',
    'style.css',
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
    'cache.js',
    'index.js',
    'main.js',
    'service-worker.js'
];
const SYNC = 'pwa-sync';

function preCache() {
    return caches.open(CACHE).then(cache => {
        console.log('preCache: caching assets...');
        return cache.addAll(ASSETS);
    });
}

function dynamicCache(request) {
    return caches.match(request).then(matching => {
        if (matching) {
            console.log('dynamicCache: matched request.', request.url);
            return matching;
        } else {
            console.log('dynamicCache: match failed, fetching request...', request.url);
            return fetch(request).then(response => {
                return caches.open(CACHE).then(cache => {
                    cache.put(request.url, response.clone());
                    console.log('dynamicCache: dynamically cached asset.', request.url);
                    return response;
                }).
                catch(error => {
                    console.log('dynamicCache: failed! getting offline.html...', request.url, error);
                    return caches.open(CACHE).then(cache => cache.match('/offline.html'));
                });
            });
        }
    });
}