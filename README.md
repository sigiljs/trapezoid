<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/Isosceles_trapezoid.jpg" alt="Trapezoid logo"/>
</p>

#Trapezoid
Trapezoid is a simple web framework for service workers. It features:
* easily intercepting fetches

#Install

simply reference our CDN file on rawgit in your service worker:
```javascript
importScripts(https://cdn.rawgit.com/sigiljs/trapezoid/master/trapezoid.js)
```

#Hello World

This service worker will return hello world next time you visit the base url of service worker scope:

```javascript
importScripts("trapezoid.js")

var app = trapezoid();

app.get("/",function(req,res){
  res.send("Hello World")
})

self.addEventListener('install', function(event,options) {
  console.log("Installing Service Worker");
});

self.addEventListener('fetch', function(event) {
  app.process(event);
});

```
