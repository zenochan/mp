"use strict";function _interopRequireWildcard(o){if(o&&o.__esModule)return o;var e={};if(null!=o)for(var t in o)Object.prototype.hasOwnProperty.call(o,t)&&(e[t]=o[t]);return e.default=o,e}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},_Rx=require("./Rx"),Rx=_interopRequireWildcard(_Rx),ob={Rx:{}};for(var p in Rx)ob.Rx[p]=Rx[p];var _loop=function(o){switch(_typeof(wx[o])){case"object":ob[o]=Object.assign(wx[o]);break;case"function":/Sync$/.test(o)?ob[o]=function(e){return Rx.Observable.of(wx[o].call(null,e))}:ob[o]=function(e){return Rx.Observable.create(function(t){var r=Object.assign({},e);r.success=function(){return t.next.apply(t,arguments)},r.fail=function(o){return t.error(o)},r.complete=function(o){return t.complete()},wx[o].call(null,r)})};break;default:ob[o]=wx[o]}};for(var _p in wx)_loop(_p);module.exports=ob;