const CACHE = 'todo-cache';
const ASSETS = [
    '/',
    'index.html',
    'style.css',
    'w3.4.10.css',
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
    'registrar.js',
    'model.js',
    'cache.js',
    'service-worker.js'
];
const SYNC = 'todo-sync';

function preCache() {
    return caches.open(CACHE).then(cache => {
        console.log('preCache: caching assets...');
        return cache.addAll(ASSETS);
    });
}

function fromCache(request) {
    return caches.match(request).then(matching => {
        if (matching) {
            console.log('fromCache: matched request.', request.url);
            return matching;
        } else {
            console.log('fromCache: match failed.', request.url);
            return Promise.reject;
        }
    });
}