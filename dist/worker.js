!function(t){var e={};function a(n){if(e[n])return e[n].exports;var r=e[n]={i:n,l:!1,exports:{}};return t[n].call(r.exports,r,r.exports,a),r.l=!0,r.exports}a.m=t,a.c=e,a.d=function(t,e,n){a.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},a.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.t=function(t,e){if(1&e&&(t=a(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)a.d(n,r,function(e){return t[e]}.bind(null,r));return n},a.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return a.d(e,"a",e),e},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},a.p="",a(a.s=0)}([function(t,e,a){"use strict";async function n(t,e={}){const a=new Request(t,e),n=new Request(t,a),r=caches.default;let s=await r.match(n);return s||(s=await fetch(a),s=new Response(s.body,s),s.headers.append("Cache-Control","s-maxage=30"),r.put(n,s.clone())),s}async function r(){const{usage_data:t,plant_data:e}=await async function(){let t=[n("https://www.taipower.com.tw/d006/loadGraph/loadGraph/data/loadpara.json").then(t=>t.json()),n("https://www.taipower.com.tw/d006/loadGraph/loadGraph/data/genary.json").then(t=>t.json())],[e,a]=await Promise.all(t);return{usage_data:e,plant_data:a}}();return function({usage_data:t,plant_data:e}){let a={time:e[""],usage:{current:parseFloat(10*t.records[0].curr_load),capacity:parseFloat(10*t.records[1].fore_maxi_sply_capacity),percentage:parseFloat(t.records[0].curr_util_rate)},statistics:{total:0},plants:{}};e.aaData.forEach(t=>{if(t[1].includes("小計"))return;let e={type:"",name:t[1].replaceAll(/\(註\d{1,2}\)/g,"").replaceAll(/&amp;/g,"&"),max:parseFloat(t[2])||0,now:parseFloat(t[3])||0,percentage:parseInt(parseFloat(t[3])/parseFloat(t[2])*1e3)/10,description:t[5].trim()};try{e.type=Array.from(t[0].matchAll(/<b>([^]+?)<\/b>/g))[0][1]}catch(t){}a.plants[e.type]||(a.plants[e.type]=[]),a.statistics[e.type]||(a.statistics[e.type]=0),a.plants[e.type].push(e),a.statistics[e.type]+=e.now});for(let[t,e]of Object.entries(a.statistics))a.statistics[t]=parseInt(100*e)/100;return a.statistics.total=parseInt(100*Object.values(a.statistics).reduce((t,e)=>t+e))/100,a}({usage_data:t,plant_data:e})}a.r(e),addEventListener("fetch",t=>{t.respondWith(async function(t){const e=t.request,a=e.headers.get("Upgrade");if(a&&"websocket"===a)return async function(t){const e=new WebSocketPair,[a,n]=Object.values(e);n.accept();const s={timestamp:new Date,msg:"check"};let o=await r();return n.send(JSON.stringify(o)),setInterval(()=>{n.send(JSON.stringify(s))},6e4),setInterval(async()=>{let t=await r();t.time!==o.time&&(o=t,n.send(JSON.stringify(o)))},3e5),setInterval(()=>{n.send(JSON.stringify({timestamp:new Date,msg:"closed"}))},54e5),n.addEventListener("message",async t=>{t.data}),n.addEventListener("close",async t=>{console.log("Connection Closed.")}),new Response(null,{status:101,webSocket:a})}();{const a=new URL(e.url).origin+"/",n=new Request(a,e),s=caches.default;let o=await s.match(n);if(!o){const e=await r();o=new Response(JSON.stringify(e,null,4),{headers:{"Content-Type":"application/json","Cross-Origin-Resource-Policy":"cross-origin","Access-Control-Allow-Origin":"*","Access-Control-Allow-Credentials":"true"}}),o.headers.append("Cache-Control","s-maxage=30"),t.waitUntil(s.put(n,o.clone()))}return o}}(t))}),addEventListener("scheduled",t=>{t.waitUntil(async function(t){}())})}]);