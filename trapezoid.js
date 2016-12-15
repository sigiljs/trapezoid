function trapezoid(){
  var ret = {
    processors: {
      GET:[],
      POST:[],
      PUT:[],
      DELETE:[]
    },
    process: function(event){
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
    post: function(path,fn){
      ret.processors.POST.push({
        path: path,
        fn:fn
      })
    },
    put: function(path,fn){
      ret.processors.PUT.push({
        path: path,
        fn:fn
      })
    },
    delete: function(path,fn){
      ret.processors.DELETE.push({
        path: path,
        fn:fn
      })
    }
  }
  return ret;
}
