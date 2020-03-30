"use strict";
exports.__esModule = true;
var Events_1 = require("./Events");
var KEY_USER = "user_181127";
var Data = /** @class */ (function () {
    function Data() {
    }
    Data.getUser = function () {
        return wx.getStorageSync(KEY_USER);
    };
    Data.setUser = function (user) {
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
        if (value == null || typeof value == "undefined") {
            wx.removeStorageSync(key);
        }
        else {
            wx.setStorageSync(key, value);
        }
    };
    Data.setAsync = function (key, value) {
        if (!key)
            return;
        wx.setStorage({
            key: key,
            data: value
        });
    };
    Data.clear = function () {
        wx.clearStorage();
    };
    return Data;
}());
exports.Data = Data;
