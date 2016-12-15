<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/Isosceles_trapezoid.jpg" alt="Trapezoid logo"/>
</p>

#Trapezoid
Trapezoid is a simple web framework for service workers. It features:
* easily defining caches
* easily intercepting fetches and passing custom values

#Install

simply reference our CDN file on rawgit in your service worker:
```javascript
importScripts("https://cdn.rawgit.com/sigiljs/trapezoid/master/trapezoid.js")
```

#Hello World
app.js
```javascript
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('sw.js').then(function(registration) {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(function(err) {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
```

sw.js
```javascript
//Get things started
importScripts("trapezoid.js")
var app = trapezoid();

//Create a custom GET handler
app.get("/",function(req,res){
  res.send("you made it to root! ")
})

//Declare something to pre-cache
app.cache("/test.json");

//Create a handler for when offline only
app.offline("/offline.json",function(req,res){
  res.send("offline");
})

//Give it a unique name for cacheing
app.run("helloworld-v1");
```
