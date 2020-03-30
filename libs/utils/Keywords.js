"use strict";
exports.__esModule = true;
var Keywords = /** @class */ (function () {
    function Keywords() {
    }
    Keywords.data = function (type) {
        if (type === void 0) { type = 'default'; }
        return wx.getStorageSync(this.KEY + type) || [];
    };
    Keywords.save = function (keyword, type) {
        if (type === void 0) { type = 'default'; }
        var records = this.data(type);
        records.unshift(keyword);
        // @ts-ignore
        records = Array.from(new Set(records));
        wx.setStorageSync(this.KEY + type, records);
    };
    Keywords.clear = function (type) {
        wx.setStorageSync(type || this.KEY, []);
    };
    Keywords.KEY = "keywords:";
    return Keywords;
}());
exports.Keywords = Keywords;
