'use strict';

function trapezoid() {
  var ret = {
    urlsToCache: [],
    processors: {
      GET: []
    },
    processCache: function processCache(event, cacheName) {
      event.waitUntil(caches.open(cacheName).then(function (cache) {
        return cache.addAll(ret.urlsToCache);
      }));
    },
    doProcessor: function doProcessor(processor, request) {
      return new Promise(function (resolve) {
        var init = {
          status: 200,
          statusText: 'OK',
          headers: { 'Content-Type': 'text/html' }
        };

        var res = {
          type: function type(mime) {
            init['Content-Type'] = mime;
          },
          send: function send(text) {
            var response = new Response(text, init);
            resolve(response);
          }
        };
        processor.fn(request, res);
      });
    },
    processFetch: function processFetch(event) {
      function doSomething() {
        var method = event.request.method;
        var path = event.request.url.substr(self.location.href.lastIndexOf('/'));

        var processors = ret.processors[method];
        var processor = null;
        for (var i = 0; i < processors.length; i++) {
          if (processors[i].path === path) {
            processor = processors[i];
            break;
          }
        }
        if (processor) {
          if (processor.cache) {
            return caches.match(event.request).then(function (response) {
              return response;
            });
          } else if (processor.offline) {
            return new Promise(function (resolve) {
              fetch(event.request).then(function (fetchResponse) {
                resolve(fetchResponse);
              }).catch(function () {
                ret.doProcessor(processor, event.request).then(function (processorResponse) {
                  resolve(processorResponse);
                });
              });
            });
          }
          return ret.doProcessor(processor, event.request);
        }
        return fetch(event.request);
      }
      event.respondWith(doSomething());
    },
    get: function get(path, fn) {
      ret.processors.GET.push({
        path: path,
        fn: fn
      });
    },
    offline: function offline(path, fn) {
      ret.processors.GET.push({
        path: path,
        fn: fn,
        offline: true
      });
    },
    useCache: function useCache(path) {
      ret.processors.GET.push({
        path: path,
        cache: true
      });
    },
    precache: function precache(path) {
      if (Array.isArray(path)) {
        ret.urlsToCache = ret.urlsToCache.concat(path);
      } else {
        ret.urlsToCache.push(path);
      }
    },
    run: function run(cacheName) {
      self.addEventListener('install', function (event) {
        ret.processCache(event, cacheName);
      });
      self.addEventListener('fetch', function (event) {
        ret.processFetch(event);
      });
    }
  };
  return ret;
}
