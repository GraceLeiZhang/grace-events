/* 雅实 Grace Rock service worker.
   Network first for everything on this site, so visitors always get the
   latest page when they are online. The cache is only a fallback for when
   the phone is offline. Other sites (fonts, maps, chat) are not touched. */
var CACHE = 'gracerock-v1';
var CORE = ['/preview/', '/preview/en.html', '/lang.js', '/share.js', '/pwa.js',
  '/icons/icon-192.png', '/manifest.webmanifest'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(CORE); }).catch(function () {}));
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return;
  e.respondWith(
    fetch(req).then(function (res) {
      if (res && res.ok && res.type === 'basic') {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
      }
      return res;
    }).catch(function () {
      return caches.match(req, { ignoreSearch: req.mode === 'navigate' }).then(function (hit) {
        if (hit) return hit;
        if (req.mode === 'navigate') {
          return caches.match(/^\/preview\/.*en/.test(url.pathname) || /-en\.html$/.test(url.pathname) ? '/preview/en.html' : '/preview/');
        }
        return Response.error();
      });
    })
  );
});
