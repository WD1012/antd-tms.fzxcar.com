webpackJsonp([55],{1342:function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var u=r(78),a=n(u),o=r(4),s=n(o),i=r(187),c=r(2127),l=r(293),f=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t}(l);t.default={namespace:"login",state:{},effects:{login:a.default.mark(function(e,t){var r,n,u,o,l,p=e.payload,d=t.put,h=t.call,v=t.select;return a.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,h(c._login,p);case 2:return r=e.sent,e.next=5,v(function(e){return e.app});case 5:if(n=e.sent,u=n.locationQuery,!r){e.next=23;break}return o=(0,s.default)({},r.data.data),console.log(o),f.setCookie("token",o,1),l=u.from,e.next=14,d({type:"app/query",payload:{data:r,cookie:f}});case 14:if(!l||"/login"===l){e.next=19;break}return e.next=17,d(i.routerRedux.push(l));case 17:e.next=21;break;case 19:return e.next=21,d(i.routerRedux.push("/dashboard"));case 21:e.next=24;break;case 23:throw r;case 24:case"end":return e.stop()}},c.login,this)})}},e.exports=t.default},2127:function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.logout=t._login=t.login=void 0;var u=r(78),a=n(u),o=r(136),s=n(o),i=r(137),c=n(i),l=(t.login=function(){var e=(0,c.default)(a.default.mark(function e(t){return a.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,l.dvarequest)("http://10.3.10.92:8071/usf-serv-rest-0.0.1-SNAPSHOT/api/v1/user/login",{method:"post",body:(0,s.default)(t)}));case 1:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}(),t._login=function(){var e=(0,c.default)(a.default.mark(function e(t){return a.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return console.log((0,s.default)(t)),e.abrupt("return",(0,l.dvarequest)(""+p,{headers:{"Content-Type":"application/json",Accept:"application/json"},method:"post",body:(0,s.default)(t)}));case 2:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}(),t.logout=function(){var e=(0,c.default)(a.default.mark(function e(t){return a.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,l.dvarequest)("http://10.3.10.92:8071/usf-serv-rest-0.0.1-SNAPSHOT/api/v1/user/login",{method:"post",body:(0,s.default)(t)}));case 1:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}(),r(73)),f=l.config.api,p=f.userLogin}});