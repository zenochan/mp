"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UI_1 = require("./UI");
var WX_1 = require("./WX");
var Nav = /** @class */ (function () {
    function Nav() {
    }
    Nav.nav = function (url) {
        var _this = this;
        if (/^(pages|package)/.test(url)) {
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
        var page = WX_1.WX.page();
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
    /**
     * 数据有变化， 上一个页面需要刷新
     */
    Nav.refreshPre = function () {
        WX_1.WX.pagePre().subscribe(function (page) { return page.onceRefresh = true; });
    };
    Nav.navBack = function (data) {
        var pages = getCurrentPages();
        var prePage = pages[pages.length - 2];
        if (prePage && prePage.holder) {
            // 需要等待上衣页面 onShow 后再传回参数, 否则后续页面的 modal 会在当前页面出现，然后跟随页面消失
            prePage.zzLife().filter(function (res) { return res == "onShow"; }).take(1).subscribe(function (res) {
                var cb = prePage.holder.onResult;
                cb && cb(data);
                prePage.holder.onResult = null;
            });
        }
        wx.navigateBack();
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