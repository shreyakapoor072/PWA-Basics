const staticCacheName ="site-static-v1";
const assets = [
    '/',
    '/index.html',
    '/js/app.js',
    '/js/main.js',
    '/css/styles.css',
    '/css/materialize.min.css',
    '/img/dish.png',
    '/js/materialize.min.js',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v67/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2'
]

// self here refers to service worker itself

// install service worker
self.addEventListener('install',  event => {
    console.log("install event");
    /*we are using wait until bec install might get finished in split sec and service worker might stop if its not doing anything and by that time 
    caching might not have been fully completed */
    //wait until expects a promise
    event.waitUntil(
        caches.open(staticCacheName).then(cache => {
            console.log('caching resources');
            cache.addAll(assets); //cache.add - for single resource
        })
    )
});

// service worker activated
self.addEventListener('activate',  event => {
    console.log("service worker activated");
    // delete old cache here
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys
                .filter( key => key !== staticCacheName)
                .map( key => caches.delete(key))
                // caches.delete is also an asynchronous tasks hence we are using promise.all
                // waitUnitl also expects an async task
            )
        })
    )
});


// keep track of all fetch requests
self.addEventListener('fetch', event => {
    console.log("fetch event", event);
    // respondWith pause fetch callback and allows us to write our custom funciton
    event.respondWith(
        //caches.match looks in all caches 
        caches.match(event.request).then( cacheRes => {
            // cacheREs will be empty if requested resource is not cached.
            return cacheRes || fetch(event.request);
        })
    )
})
