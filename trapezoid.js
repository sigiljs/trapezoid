function trapezoid(){
  var ret = {
    urlsToCache:[],
    processors: {
      GET:[]
    },
    processCache: function(event,cacheName){
      event.waitUntil(
        caches.open(cacheName)
          .then(function(cache) {
            console.log("cacheing "+ret.urlsToCache);
            return cache.addAll(ret.urlsToCache);
          })
      );
    },
    doProcessor: function(processor,request){
      return new Promise(function(resolve){
        var init = {
          status: 200,
          statusText: "OK",
          headers: {'Content-Type': 'text/html'}
        };

        var res = {
          send: function(text){
            var response = new Response(text, init);
            resolve(response);
          }
        }
        processor.fn(request,res);
      })
    },
    processFetch: function(event){
      event.respondWith(
        caches.match(event.request)
          .then(function(response) {
            // Cache hit - return response
            if (response) {
              return response;
            }
            var method = event.request.method;
            var path = event.request.url.substr(self.location.href.lastIndexOf("/"));

            var processors = ret.processors[method];
            var processor = null;
            for(var i = 0 ; i < processors.length; i++){
              if( processors[i].path === path ){
                processor = processors[i];
                break;
              }
            }
            if(processor){
              return ret.doProcessor(processor,event.request);
            }
            else {
              return fetch(event.request);
            }
          }
        )
      );

    },
    get: function(path,fn){
      ret.processors.GET.push({
        path: path,
        fn:fn
      })
    },
    cache: function(path,fn){
      ret.urlsToCache.push(path);
      ret.processors.GET.push({
        path: path,
        fn:fn
      })
    },
    run: function(cacheName){
      self.addEventListener('install', function(event) {
        ret.processCache(event,cacheName);
      });
      self.addEventListener('fetch', function(event) {
        ret.processFetch(event);
      });
    }
  }
  return ret;
}
