"use strict";
exports.__esModule = true;
exports.Timing = void 0;
var Timing = /** @class */ (function () {
    function Timing() {
    }
    Timing.easeIn = function (pos) {
        return Math.pow(pos, 3);
    };
    Timing.easeOut = function (pos) {
        return (Math.pow((pos - 1), 3) + 1);
    };
    Timing.easeInOut = function (pos) {
        if ((pos /= 0.5) < 1) {
            return 0.5 * Math.pow(pos, 3);
        }
        else {
            return 0.5 * (Math.pow((pos - 2), 3) + 2);
        }
    };
    Timing.linear = function (pos) {
        return pos;
    };
    return Timing;
}());
exports.Timing = Timing;
