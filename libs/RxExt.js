"use strict";
exports.__esModule = true;
var Rx_1 = require("./rxjs-wx/Rx");
function rxJust(value) {
    return Rx_1.Observable.create(function (sub) {
        sub.next(value);
        sub.complete();
    });
}
exports.rxJust = rxJust;
function rxFromPromise(promise) {
    return Rx_1.Observable.create(function (sub) {
        promise.then(function (res) {
            sub.next(res);
            sub.complete();
        })["catch"](function (e) { return sub.error(e); });
    });
}
exports.rxFromPromise = rxFromPromise;
//# sourceMappingURL=RxExt.js.map