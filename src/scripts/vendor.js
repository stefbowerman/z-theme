(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};!function(e,t,n){function r(e,t){return(void 0===e?"undefined":_typeof(e))===t}function o(){return"function"!=typeof t.createElement?t.createElement(arguments[0]):x?t.createElementNS.call(t,"http://www.w3.org/2000/svg",arguments[0]):t.createElement.apply(t,arguments)}function s(e,t){return!!~(""+e).indexOf(t)}function i(e){return e.replace(/([a-z])-([a-z])/g,function(e,t,n){return t+n.toUpperCase()}).replace(/^-/,"")}function a(e,n,r,s){var i,a,l,f,u="modernizr",p=o("div"),c=function(){var e=t.body;return e||((e=o(x?"svg":"body")).fake=!0),e}();if(parseInt(r,10))for(;r--;)(l=o("div")).id=s?s[r]:u+(r+1),p.appendChild(l);return(i=o("style")).type="text/css",i.id="s"+u,(c.fake?c:p).appendChild(i),c.appendChild(p),i.styleSheet?i.styleSheet.cssText=e:i.appendChild(t.createTextNode(e)),p.id=u,c.fake&&(c.style.background="",c.style.overflow="hidden",f=w.style.overflow,w.style.overflow="hidden",w.appendChild(c)),a=n(p,e),c.fake?(c.parentNode.removeChild(c),w.style.overflow=f,w.offsetHeight):p.parentNode.removeChild(p),!!a}function l(e,t){return function(){return e.apply(t,arguments)}}function f(e){return e.replace(/([A-Z])/g,function(e,t){return"-"+t.toLowerCase()}).replace(/^ms-/,"-ms-")}function u(t,n,r){var o;if("getComputedStyle"in e){o=getComputedStyle.call(e,t,n);var s=e.console;if(null!==o)r&&(o=o.getPropertyValue(r));else if(s){s[s.error?"error":"log"].call(s,"getComputedStyle returning null, its possible modernizr test results are inaccurate")}}else o=!n&&t.currentStyle&&t.currentStyle[r];return o}function p(t,r){var o=t.length;if("CSS"in e&&"supports"in e.CSS){for(;o--;)if(e.CSS.supports(f(t[o]),r))return!0;return!1}if("CSSSupportsRule"in e){for(var s=[];o--;)s.push("("+f(t[o])+":"+r+")");return a("@supports ("+(s=s.join(" or "))+") { #modernizr { position: absolute; } }",function(e){return"absolute"==u(e,null,"position")})}return n}function c(e,t,a,l){function f(){c&&(delete N.style,delete N.modElem)}if(l=!r(l,"undefined")&&l,!r(a,"undefined")){var u=p(e,a);if(!r(u,"undefined"))return u}for(var c,d,m,y,h,v=["modernizr","tspan","samp"];!N.style&&v.length;)c=!0,N.modElem=o(v.shift()),N.style=N.modElem.style;for(m=e.length,d=0;m>d;d++)if(y=e[d],h=N.style[y],s(y,"-")&&(y=i(y)),N.style[y]!==n){if(l||r(a,"undefined"))return f(),"pfx"!=t||y;try{N.style[y]=a}catch(e){}if(N.style[y]!=h)return f(),"pfx"!=t||y}return f(),!1}function d(e,t,n,o,s){var i=e.charAt(0).toUpperCase()+e.slice(1),a=(e+" "+P.join(i+" ")+i).split(" ");return r(t,"string")||r(t,"undefined")?c(a,t,o,s):function(e,t,n){var o;for(var s in e)if(e[s]in t)return!1===n?e[s]:r(o=t[e[s]],"function")?l(o,n||t):o;return!1}(a=(e+" "+b.join(i+" ")+i).split(" "),t,n)}function m(e,t,r){return d(e,n,n,t,r)}var y=[],h=[],v={_version:"3.5.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,t){var n=this;setTimeout(function(){t(n[e])},0)},addTest:function(e,t,n){h.push({name:e,fn:t,options:n})},addAsyncTest:function(e){h.push({name:null,fn:e})}},g=function(){};g.prototype=v,(g=new g).addTest("svg",!!t.createElementNS&&!!t.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect);var S=v._config.usePrefixes?" -webkit- -moz- -o- -ms- ".split(" "):["",""];v._prefixes=S;var w=t.documentElement,x="svg"===w.nodeName.toLowerCase(),C="Moz O ms Webkit",b=v._config.usePrefixes?C.toLowerCase().split(" "):[];v._domPrefixes=b;var _="CSS"in e&&"supports"in e.CSS,T="supportsCSS"in e;g.addTest("supports",_||T),g.addTest("placeholder","placeholder"in o("input")&&"placeholder"in o("textarea"));var P=v._config.usePrefixes?C.split(" "):[];v._cssomPrefixes=P;var z=v.testStyles=a;g.addTest("touchevents",function(){var n;if("ontouchstart"in e||e.DocumentTouch&&t instanceof DocumentTouch)n=!0;else{var r=["@media (",S.join("touch-enabled),("),"heartz",")","{#modernizr{top:9px;position:absolute}}"].join("");z(r,function(e){n=9===e.offsetTop})}return n});var E={elem:o("modernizr")};g._q.push(function(){delete E.elem});var N={style:E.elem.style};g._q.unshift(function(){delete N.style}),v.testProp=function(e,t,r){return c([e],n,t,r)},v.testAllProps=d,v.testAllProps=m,g.addTest("flexbox",m("flexBasis","1px",!0)),g.addTest("csstransforms",function(){return-1===navigator.userAgent.indexOf("Android 2.")&&m("transform","scale(1)",!0)}),g.addTest("csstransforms3d",function(){var e=!!m("perspective","1px",!0),t=g._config.usePrefixes;if(e&&(!t||"webkitPerspective"in w.style)){var n;g.supports?n="@supports (perspective: 1px)":(n="@media (transform-3d)",t&&(n+=",(-webkit-transform-3d)")),z("#modernizr{width:0;height:0}"+(n+="{#modernizr{width:7px;height:18px;margin:0;padding:0;border:0}}"),function(t){e=7===t.offsetWidth&&18===t.offsetHeight})}return e}),g.addTest("csstransitions",m("transition","all",!0)),function(){var e,t,n,o,s,i;for(var a in h)if(h.hasOwnProperty(a)){if(e=[],(t=h[a]).name&&(e.push(t.name.toLowerCase()),t.options&&t.options.aliases&&t.options.aliases.length))for(n=0;n<t.options.aliases.length;n++)e.push(t.options.aliases[n].toLowerCase());for(o=r(t.fn,"function")?t.fn():t.fn,s=0;s<e.length;s++)1===(i=e[s].split(".")).length?g[i[0]]=o:(!g[i[0]]||g[i[0]]instanceof Boolean||(g[i[0]]=new Boolean(g[i[0]])),g[i[0]][i[1]]=o),y.push((o?"":"no-")+i.join("-"))}}(),function(e){var t=w.className,n=g._config.classPrefix||"";if(x&&(t=t.baseVal),g._config.enableJSClass){var r=new RegExp("(^|\\s)"+n+"no-js(\\s|$)");t=t.replace(r,"$1"+n+"js$2")}g._config.enableClasses&&(t+=" "+n+e.join(" "+n),x?w.className.baseVal=t:w.className=t)}(y),delete v.addTest,delete v.addAsyncTest;for(var j=0;j<g._q.length;j++)g._q[j]();e.Modernizr=g}(window,document);

},{}]},{},[1]);
