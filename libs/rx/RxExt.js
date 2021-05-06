"use strict";
exports.__esModule = true;
exports.rxFromPromise = exports.rxEmpty = exports.rxJust = void 0;
var Rx_1 = require("./Rx");
function rxJust(value) {
    return Rx_1.Observable.create(function (sub) {
        sub.next(value);
        sub.complete();
    });
}
exports.rxJust = rxJust;
function rxEmpty() {
    return Rx_1.Observable.create(function (sub) {
        sub.complete();
    });
}
exports.rxEmpty = rxEmpty;
function rxFromPromise(promise) {
    return Rx_1.Observable.create(function (sub) {
        promise.then(function (res) {
            sub.next(res);
            sub.complete();
        })["catch"](function (e) { return sub.error(e); });
    });
}
exports.rxFromPromise = rxFromPromise;
// @ts-ignore
Rx_1.Observable.prototype.pipe = function (transfer) {
    return transfer(this);
};
