"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Events_1 = require("./Events");
var KEY_USER = "user_181127";
var Data = /** @class */ (function () {
    function Data() {
    }
    Data.getUser = function () {
        var user = wx.getStorageSync(KEY_USER);
        return user;
    };
    Data.setUser = function (user) {
        // user['api_token'] = "89dcf1966e8cf79d91b863c0a11773c1";
        wx.setStorageSync(KEY_USER, user);
        user && Events_1.Events.publish("user:update", user);
    };
    /**
     * @param key 建议使用蛇形 key
     */
    Data.get = function (key) {
        if (!key)
            return null;
        return wx.getStorageSync(key);
    };
    Data.set = function (key, value) {
        if (!key)
            return;
        wx.setStorageSync(key, value);
    };
    Data.setAsync = function (key, value) {
        if (!key)
            return;
        wx.setStorage({
            key: key,
            data: value
        });
    };
    /**
     * 获取事件绑定的数据
     * @param e {Event}
     * @param key {string}
     */
    Data.eData = function (e, key) {
        if (key === void 0) { key = "data"; }
        return e.currentTarget.dataset[key];
    };
    Data.clear = function () {
        wx.clearStorage();
    };
    return Data;
}());
exports.Data = Data;
//# sourceMappingURL=Data.js.map