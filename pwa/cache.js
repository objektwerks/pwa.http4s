const CACHE = 'pwa-cache';
const ASSETS = [
    'index.html',
    'offline.html',
    'style.css',
    'favicon.ico',
    'logo.png',
    'logo-192x192.png',
    'logo-512x512.png',
    'ios-logo-96x96.png',
    'ios-logo-152x152.png',
    'ios-logo-167x167.png',
    'ios-logo-180x180.png',
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