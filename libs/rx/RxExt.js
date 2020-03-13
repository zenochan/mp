"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        }).catch(function (e) { return sub.error(e); });
    });
}
exports.rxFromPromise = rxFromPromise;
//# sourceMappingURL=RxExt.js.map