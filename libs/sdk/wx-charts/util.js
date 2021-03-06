"use strict";
exports.__esModule = true;
exports.Util = void 0;
var Util = /** @class */ (function () {
    function Util() {
    }
    Util.toFixed = function (num, limit) {
        if (limit === void 0) { limit = 2; }
        if (this.isFloat(num)) {
            num = num.toFixed(limit);
        }
        return num;
    };
    Util.isFloat = function (num) {
        return num % 1 !== 0;
    };
    Util.approximatelyEqual = function (num1, num2) {
        return Math.abs(num1 - num2) < 1e-10;
    };
    Util.isSameSign = function (num1, num2) {
        return (Math.abs(num1) === num1 && Math.abs(num2) === num2)
            || (Math.abs(num1) !== num1 && Math.abs(num2) !== num2);
    };
    Util.isSameXCoordinateArea = function (p1, p2) {
        return this.isSameSign(p1.x, p2.x);
    };
    Util.isCollision = function (obj1, obj2) {
        obj1.end = {};
        obj1.end.x = obj1.start.x + obj1.width;
        obj1.end.y = obj1.start.y - obj1.height;
        obj2.end = {};
        obj2.end.x = obj2.start.x + obj2.width;
        obj2.end.y = obj2.start.y - obj2.height;
        var flag = obj2.start.x > obj1.end.x
            || obj2.end.x < obj1.start.x
            || obj2.end.y > obj1.start.y
            || obj2.start.y < obj1.end.y;
        return !flag;
    };
    return Util;
}());
exports.Util = Util;
