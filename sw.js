var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = ['css/bootstrap.min.css',
                    'css/font-awesome.min.css',
                    'css/flaticon.css',
                    'css/magnific-popup.css',
                    'css/owl.carousel.css',
                    'css/style.css',
                    'js/jquery-2.1.4.min.js', 'js/bootstrap.min.js', 'js/main.js',
                    'js/owl.carousel.min.js',
                    'offline.html',
                    'js/magnific-popup.min.js'];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
    var request = event.request
    var url     = new URL(request.url)
      event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          if (response) {
            return response || fetch(response);     // if valid response is found in cache return it
          } else {
            return fetch(event.request)     //fetch from internet
              .then(function(res) {
                return caches.open(CACHE_NAME)
                  .then(function(cache) {
                    cache.put(event.request.url, res.clone());    //save the response for future
                    return res;   // return the fetched data
                  })
              })
              .catch(function(err) {       // fallback mechanism
                return caches.open(CACHE_CONTAINING_ERROR_MESSAGES)
                  .then(function(cache) {
                    return cache.match('/offline.html');
                  });
              });
          }
        })
    );
});

self.addEventListener('activate', function(event) {

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
            return cacheName != CACHE_NAME;
        }).map(function(cacheName){
            return caches.delete(cacheName)
        })
      );
    })
  );
});
