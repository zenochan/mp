"use strict";
exports.__esModule = true;
exports.Event = void 0;
var Event = /** @class */ (function () {
    function Event() {
        this.events = {};
    }
    Event.prototype.addEventListener = function (type, listener) {
        this.events[type] = this.events[type] || [];
        this.events[type].push(listener);
    };
    Event.prototype.trigger = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var type = args[0];
        var params = args.slice(1);
        if (!!this.events[type]) {
            this.events[type].forEach(function (listener) {
                try {
                    listener.apply(null, params);
                }
                catch (e) {
                    console.error(e);
                }
            });
        }
    };
    return Event;
}());
exports.Event = Event;
