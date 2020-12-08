"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        if (type === void 0) { type = 'default'; }
        wx.setStorageSync(this.KEY + type, []);
    };
    Keywords.KEY = 'keywords:';
    return Keywords;
}());
exports.Keywords = Keywords;
//# sourceMappingURL=Keywords.js.map