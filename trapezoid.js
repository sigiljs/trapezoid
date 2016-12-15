function trapezoid(){
  var ret = {
    processors: {
      urlsToCache:[],
      GET:[]
    },
    processCache: function(event,cacheName){
      event.waitUntil(
        caches.open(CACHE_NAME)
          .then(function(cache) {
            return cache.addAll(ret.urlsToCache);
          })
      );
    },
    processFetch: function(event){
      var method = event.request.method;
      var path = event.request.url.substr(self.location.href.lastIndexOf("/"));

      var processors = ret.processors[method];

      for(var i = 0 ; i < processors.length; i++){
        var processor = processors[i];
        if( processor.path === path ){
          var init = {
            status: 200,
            statusText: "OK",
            headers: {'Content-Type': 'text/html'}
          };

          var res = {
            send: function(text){
              var response = new Response(text, init);
              event.respondWith(
                response
              );
            }
          }
          processor.fn(event.request,res)
          return;
        }
      }
    },
    get: function(path,fn){
      ret.processors.GET.push({
        path: path,
        fn:fn
      })
    },
    cache: function(path,fn){
      ret.urlsToCache.push(path);
    },
    run: function(context,cacheName){
      context.addEventListener('install', function(event) {
        ret.processCache(event,cacheName);
      });
      context.addEventListener('fetch', function(event) {
        ret.processFetch(event);
      });
    }
  }
  return ret;
}
