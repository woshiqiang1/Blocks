"use strict";var vdom=function(e,t){for(var n=arguments.length,r=Array(n>2?n-2:0),o=2;o<n;o++)r[o-2]=arguments[o];return"string"!=typeof e?e(t):(r.forEach(function(e,t){if(Array.isArray(e)){var n=e;r.splice(t,1),n.forEach(function(e,n){var o=t+n;r.splice(o,0,e)})}}),{type:e,props:t||{},children:r})};function isEventProp(e){return/^on/.test(e)}function extractEventName(e){return e.slice(2).toLowerCase()}function addEventListener(e,t,n){var r=extractEventName(t);e.addEventListener(r,n)}function addProp(e,t,n){"className"===t?e.setAttribute("class",n):e.setAttribute(t,n)}function makeElements(e){if("string"==typeof e)return document.createTextNode(e);var t=e.type,n=e.props,r=e.children,o=document.createElement(t);if(n&&Object.keys(n).forEach(function(e){isEventProp(e)?addEventListener(o,e,n[e]):addProp(o,e,n[e])}),"string"==typeof r){var i=document.createTextNode(r);o.appendChild(i)}else if(e.children){var f=document.appendChild.bind(o);e.children.map(makeElements).forEach(f)}return o}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},classCallCheck=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();function isDifferentNode(e,t){var n=(void 0===e?"undefined":_typeof(e))!==(void 0===t?"undefined":_typeof(t)),r=e.type!==t.type;return n||r}function removeProp(e,t){"className"===t?e.removeAttribute("class"):e.removeAttribute(t)}function removeEventListener(e,t,n){var r=extractEventName(t);e.removeEventListener(r,n)}var isDifferentFunction=function(e,t){return e.toString()!==t.toString()};function diffEventProp(e,t,n,r){r?n?isDifferentFunction(r,n)&&(removeEventListener(e,t,r),addEventListener(e,t,n)):removeEventListener(e,t,r):addEventListener(e,t,n)}function diffProp(e,t,n,r){r?n?r!==n&&addProp(e,t,n):removeProp(e,t):addProp(e,t,n)}function diffProps(e,t,n){var r=Object.assign({},t,n);Object.keys(r).forEach(function(r){isEventProp(r)?diffEventProp(e,r,t[r],n[r]):diffProp(e,r,t[r],n[r])})}function diffTextNodes(e,t,n){var r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0;if(n)if(t){if(t!==n){var o=e.childNodes[r],i=document.createTextNode(t);e.replaceChild(i,o)}}else{var f=e.childNodes[r];e.removeChild(f)}else{var a=document.createTextNode(t);e.appendChild(a)}}function diffElement(e,t,n){var r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0;if(n)if(t){if(isDifferentNode(t,n)){var o=makeElements(t),i=makeElements(n);e.replaceChild(o,i)}else if("string"==typeof t)diffTextNodes(e,t,n,r);else if(t.type&&(diffProps(e.childNodes[r],t.props,n.props),t.children))for(var f=t.children.length,a=n.children.length,c=0;c<a||c<f;c++)diffElement(e.childNodes[r],t.children[c],n.children[c],c)}else{var d=makeElements(n);e.removeChild(d)}else{var s=makeElements(t);e.appendChild(s)}}var getRefs=function(e){(arguments.length>1&&void 0!==arguments[1]?arguments[1]:document).querySelectorAll("[ref]").forEach(function(t){var n=t.getAttribute("ref"),r=t;e[n]=r})},Blocks=function(){function e(){classCallCheck(this,e),this.oldVnode=null,this.refs={}}return createClass(e,[{key:"component",value:function(e,t){for(var n=arguments.length,r=Array(n>2?n-2:0),o=2;o<n;o++)r[o-2]=arguments[o];return vdom.apply(void 0,[e,t].concat(r))}},{key:"render",value:function(e,t){diffElement(t,e,this.oldVnode),getRefs(this.refs),this.oldVnode=e}}]),e}(),index=new Blocks;module.exports=index;
