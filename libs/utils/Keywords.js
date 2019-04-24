"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var KEY = "search_keys";
var Keywords = /** @class */ (function () {
    function Keywords() {
    }
    Keywords.history = function (type) {
        return wx.getStorageSync(type || KEY) || [];
    };
    Keywords.save = function (keyword, type) {
        var records = this.history(type);
        records.unshift(keyword);
        // @ts-ignore
        records = Array.from(new Set(records));
        wx.setStorageSync(type || KEY, records);
        return records;
    };
    Keywords.clear = function (type) {
        wx.setStorageSync(type || KEY, []);
    };
    return Keywords;
}());
exports.Keywords = Keywords;
//# sourceMappingURL=Keywords.js.map