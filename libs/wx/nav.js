"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UI_1 = require("./UI");
var Nav = /** @class */ (function () {
    function Nav() {
    }
    Nav.nav = function (url) {
        wx.navigateTo({
            url: url,
            fail: function (res) { return UI_1.UI.toastFail(res.errMsg, 3000); }
        });
        return true;
    };
    /**
     * @param page
     * @param url
     * @param data
     */
    Nav.navForResult = function (page, url, data) {
        page.navData = data;
        this.nav(url);
        return new Promise(function (resolve) {
            page.onResult = function (data) {
                resolve(data);
            };
        });
    };
    Nav.navData = function () {
        var pages = getCurrentPages();
        if (pages.length <= 1)
            return null;
        return pages[pages.length - 2].navData;
    };
    Nav.navBack = function (data) {
        var pages = getCurrentPages();
        var prePage = pages[pages.length - 2];
        wx.navigateBack();
        var cb = prePage.onResult;
        cb && cb(data);
        prePage.onResult = null;
    };
    Nav.navBackOrIndex = function () {
        if (getCurrentPages().length > 1) {
            wx.navigateBack();
        }
        else {
            wx.reLaunch({ url: "/pages/index/index" });
        }
    };
    return Nav;
}());
exports.Nav = Nav;
//# sourceMappingURL=nav.js.map