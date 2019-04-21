"use strict";
exports.__esModule = true;
var KEY = "search_keys";
var SearchUtil = /** @class */ (function () {
    function SearchUtil() {
    }
    SearchUtil.searchRecords = function () {
        return wx.getStorageSync(KEY) || [];
    };
    SearchUtil.saveRecord = function (keyword) {
        var records = this.searchRecords();
        records.unshift(keyword);
        // @ts-ignore
        records = Array.from(new Set(records));
        wx.setStorageSync(KEY, records);
    };
    SearchUtil.clear = function () {
        wx.setStorageSync(KEY, []);
    };
    return SearchUtil;
}());
exports.SearchUtil = SearchUtil;
//# sourceMappingURL=SearchUtil.js.map