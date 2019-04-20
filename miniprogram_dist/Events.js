"use strict";
exports.__esModule = true;
/**
 * 微信 API rx 封装
 */
var Rx_1 = require("./rxjs-wx/Rx");
var Data_1 = require("./Data");
var Events = /** @class */ (function () {
    function Events() {
    }
    Events.sub = function (topic) {
        var a = this.subs[topic];
        if (!a) {
            a = new Rx_1.BehaviorSubject("__init__").filter(function (res) { return res != "__init__"; });
            this.subs[topic] = a;
        }
        return a;
    };
    Events.subscribe = function (topic, cb) {
        return this.sub(topic).subscribe(function (res) { return cb(res); }, function (e) { return console.error(topic, e); });
    };
    /**
     * 仅执行一次
     * @param cb
     */
    Events.userReady = function (cb) {
        var _this = this;
        Rx_1.Observable.create(function (sub) {
            _this.subscribe("user:update", function (user) {
                user = Data_1.Data.getUser();
                if (user) {
                    sub.next(user);
                    sub.complete();
                }
            });
        }).subscribe(function (user) { return cb(user); });
    };
    Events.publish = function (topic, value) {
        this.sub(topic).next(value);
    };
    Events.subs = {};
    return Events;
}());
exports.Events = Events;
//# sourceMappingURL=Events.js.map