"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UI_1 = require("./UI");
var mp_1 = require("../mp");
var Nav = /** @class */ (function () {
    function Nav() {
    }
    Nav.nav = function (url) {
        var _this = this;
        if (url.indexOf("pages/") == 0) {
            url = '/' + url;
        }
        wx.navigateTo({
            url: url,
            fail: function (res) {
                if (res.errMsg.indexOf("can not navigateTo a tabbar page") != -1) {
                    _this.switchTab(url);
                }
                else {
                    UI_1.UI.toastFail(res.errMsg, 3000);
                }
            }
        });
        return true;
    };
    /**
     * @param holder
     * @param url
     * @param data
     */
    Nav.navForResult = function (holder, url, data) {
        this.navParams = data;
        var page = mp_1.WX.page();
        page.holder = holder;
        this.nav(url);
        return new Promise(function (resolve) {
            page.holder.onResult = function (data) {
                resolve(data);
            };
        });
    };
    Nav.navData = function () {
        return this.navParams || null;
    };
    Nav.switchTab = function (page) {
        wx.switchTab({
            url: page,
            fail: function (res) { return UI_1.UI.toastFail(res.errMsg, 2000); }
        });
    };
    Nav.navBack = function (data) {
        wx.navigateBack();
        var pages = getCurrentPages();
        var prePage = pages[pages.length - 2];
        if (prePage && prePage.holder) {
            var cb = prePage.holder.onResult;
            cb && cb(data);
            prePage.holder.onResult = null;
        }
    };
    Nav.navBackOrIndex = function () {
        if (getCurrentPages().length > 1) {
            wx.navigateBack();
        }
        else {
            wx.reLaunch({ url: this.INDEX });
        }
    };
    Nav.INDEX = "/pages/index/index";
    return Nav;
}());
exports.Nav = Nav;
//# sourceMappingURL=nav.js.map