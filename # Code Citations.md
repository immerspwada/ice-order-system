# Code Citations

## License: MIT
https://github.com/merkle-open/generator-nitro/blob/4a558ac4622f82c66d2a300b72e1b504ebf47db8/packages/project-nitro-typescript/src/shared/assets/img/icon/site.webmanifest

```
",
  "icons": [
    {
      "src": "icon-192x192.png",
```


## License: unknown
https://github.com/JamesPrenticez/selfregulator/blob/5dc1f06e3ddd9f37bd6cf6bb2165ccc9a0d91cfa/frontend/README.md

```
",
  "icons": [
    {
      "src": "icon-192x192.png",
```


## License: MIT
https://github.com/merkle-open/generator-nitro/blob/4a558ac4622f82c66d2a300b72e1b504ebf47db8/packages/project-nitro-typescript/src/shared/assets/img/icon/site.webmanifest

```
",
  "icons": [
    {
      "src": "icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icon-512x512.png",
      "sizes": "512x512",
      
```


## License: unknown
https://github.com/JamesPrenticez/selfregulator/blob/5dc1f06e3ddd9f37bd6cf6bb2165ccc9a0d91cfa/frontend/README.md

```
",
  "icons": [
    {
      "src": "icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icon-512x512.png",
      "sizes": "512x512",
      
```


## License: MIT
https://github.com/merkle-open/generator-nitro/blob/4a558ac4622f82c66d2a300b72e1b504ebf47db8/packages/project-nitro-typescript/src/shared/assets/img/icon/site.webmanifest

```
",
  "icons": [
    {
      "src": "icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

#
```


## License: unknown
https://github.com/JamesPrenticez/selfregulator/blob/5dc1f06e3ddd9f37bd6cf6bb2165ccc9a0d91cfa/frontend/README.md

```
",
  "icons": [
    {
      "src": "icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

#
```


## License: unknown
https://github.com/gablaxian/gablaxian_jekyll/blob/f7924755137cbb5e454a09fd90adade77629ac18/source/ServiceWorker.js

```
;
```


## License: unknown
https://github.com/PapagenaTM/papagena/blob/e8d1d1211b893cbb7149f4c1d26a39278a1e5c77/sw.js

```
;
```


## License: unknown
https://github.com/FlyMaple/FlyMaple.github.io/blob/92f09fec4f0cc9e9cdddbf16e10829c6663c13f5/public/mhn/service-worker.js

```
;
```


## License: MIT
https://github.com/nickooms/service-worker-test/blob/9ea1e2f1562003b4bc8eb5c1ca16c5eddc6a7608/sw.js

```
;
```


## License: unknown
https://github.com/gablaxian/gablaxian_jekyll/blob/f7924755137cbb5e454a09fd90adade77629ac18/source/ServiceWorker.js

```
;

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self
```


## License: unknown
https://github.com/PapagenaTM/papagena/blob/e8d1d1211b893cbb7149f4c1d26a39278a1e5c77/sw.js

```
;

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self
```


## License: unknown
https://github.com/FlyMaple/FlyMaple.github.io/blob/92f09fec4f0cc9e9cdddbf16e10829c6663c13f5/public/mhn/service-worker.js

```
;

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self
```


## License: unknown
https://github.com/bbecquet/GeoTracker/blob/0d8b6ca578504d5c1694b781fb32f44c3da04d7c/src/sw.js

```
;

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self
```


## License: MIT
https://github.com/nickooms/service-worker-test/blob/9ea1e2f1562003b4bc8eb5c1ca16c5eddc6a7608/sw.js

```
;

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self
```


## License: unknown
https://github.com/gablaxian/gablaxian_jekyll/blob/f7924755137cbb5e454a09fd90adade77629ac18/source/ServiceWorker.js

```
;

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
```


## License: unknown
https://github.com/PapagenaTM/papagena/blob/e8d1d1211b893cbb7149f4c1d26a39278a1e5c77/sw.js

```
;

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
```


## License: unknown
https://github.com/FlyMaple/FlyMaple.github.io/blob/92f09fec4f0cc9e9cdddbf16e10829c6663c13f5/public/mhn/service-worker.js

```
;

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
```


## License: unknown
https://github.com/bbecquet/GeoTracker/blob/0d8b6ca578504d5c1694b781fb32f44c3da04d7c/src/sw.js

```
;

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
```


## License: MIT
https://github.com/nickooms/service-worker-test/blob/9ea1e2f1562003b4bc8eb5c1ca16c5eddc6a7608/sw.js

```
;

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
```


## License: unknown
https://github.com/Phil-duc/TimeKeeper/blob/a9bef0ec1705b0a8387028374d46fda2ac70b81c/main.js

```
' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(registration => console.log('Service Worker registered with scope:', registration.scope))
      .catch
```


## License: unknown
https://github.com/Phil-duc/TimeKeeper/blob/a9bef0ec1705b0a8387028374d46fda2ac70b81c/main.js

```
' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(registration => console.log('Service Worker registered with scope:', registration.scope))
      .catch(error => console.error('Service Worker registration failed:', error));
  }
  //
```

