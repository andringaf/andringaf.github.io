var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = ['css/bootstrap.min.css',
                    'css/font-awesome.min.css',
                    'css/flaticon.css',
                    'css/magnific-popup.css',
                    'css/owl.carousel.css',
                    'css/style.css',
                    'js/jquery-2.1.4.min.js', 'js/bootstrap.min.js', 'js/main.js',
                    'js/owl.carousel.min.js',
                    'fallback.json',
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
    if (url.origin === location.origin) {
      event.respondWith(
          caches.match(request).then(function(response){
            if (response) {
              return response || fetch (request)
            }
          })
      );
    }else{
      event.respondWith(
        caches.open('cv-caches').then(function(cache){
          return fetch(request).then(function(liveresponse){
            caches.put(request, liveresponse.clone())
            return liveresponse

          }).catch(function(){
            caches.match(request).then(function(response){
              if (response) { return response }
              return caches.match('/fallback.json')
            })
          })
        })
      )

    }
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
