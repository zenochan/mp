"use strict";
exports.__esModule = true;
exports.Bezier = exports.Interceptor = void 0;
var Rx_1 = require("../rx/Rx");
/**
 * @version 20190326
 * @author Zeno (zenochan@qq.com)
 */
var Interceptor = /** @class */ (function () {
    function Interceptor() {
    }
    Interceptor.liner = function (during) {
        return Rx_1.Observable.create(function (sub) {
            var value = 0;
            var timer = setInterval(function () {
                sub.next(value / during);
                value += 20;
                if (value > during)
                    clearInterval(timer);
            }, 20);
            return function () { return clearInterval(timer); };
        });
    };
    Interceptor.easeOut = function (during) {
        return Rx_1.Observable.create(function (sub) {
            var value = 0;
            var timer = setInterval(function () {
                sub.next(Bezier.value(0, 0, 0.5, 1, value / during));
                value += 20;
                if (value > during) {
                    clearInterval(timer);
                    sub.complete();
                }
            }, 20);
            return function () { return clearInterval(timer); };
        });
    };
    return Interceptor;
}());
exports.Interceptor = Interceptor;
/**
 * @param t [0,1]
 * @see http://cubic-bezier.com
 * @see https://www.cnblogs.com/yanan-boke/p/8875571.html
 * @version 20190326
 * @author Zeno (zenochan@qq.com)
 */
var Bezier = /** @class */ (function () {
    function Bezier() {
    }
    Bezier.value = function (x1, y1, x2, y2, t) {
        var cx = 3 * x1;
        var cy = 3 * y1;
        var by = 3 * (y2 - y1) - cy;
        var ay = 1 - cy - by;
        return ((ay * t + by) * t + cy) * t;
    };
    return Bezier;
}());
exports.Bezier = Bezier;
