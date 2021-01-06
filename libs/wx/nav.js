"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WX_1 = require("./WX");
var UI_1 = require("./UI");
var Nav = /** @class */ (function () {
    function Nav() {
    }
    Nav.nav = function (options) {
        var _this = this;
        var op;
        if (typeof options === 'string') {
            op = { url: options };
        }
        else {
            op = options;
        }
        var to = Route.create(op.url);
        var from = Route.create(WX_1.WX.page().route);
        runQueue(exports.NavInjectors, function (injector, next) {
            if (injector.beforeNav) {
                injector.beforeNav(to, from, next);
            }
            else {
                next();
            }
        }, function () {
            _this.actualNav(to, from, op.redirect);
        });
    };
    Nav.actualNav = function (to, from, redirect) {
        var _this = this;
        if (redirect === void 0) { redirect = false; }
        var options = {
            url: to.page(),
            fail: function (res) {
                if (res.errMsg.indexOf('tab') !== -1) {
                    _this.switchTab(to.page());
                }
                else if (res.errMsg.indexOf('fail page') !== -1) {
                    UI_1.UI.toastFail('页面不存在');
                    console.warn("\u9875\u9762\u4E0D\u5B58\u5728\uFF1A" + to.page());
                }
                else if (res.errMsg.indexOf('tabbar') !== -1) {
                    _this.switchTab(to.page());
                }
                else {
                    UI_1.UI.toastFail(res.errMsg, 3000);
                }
            },
        };
        if (redirect || to.url === from.url) {
            wx.redirectTo(options);
        }
        else {
            wx.navigateTo(options);
        }
    };
    Nav.redirect = function (url) {
        this.nav({ url: url, redirect: true });
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
    /**
     * - 在 page 中调用 {@link IPage.navParams}
     */
    Nav.navData = function () {
        return this.navParams;
    };
    Nav.switchTab = function (page) {
        wx.switchTab({
            url: page,
            fail: function (res) { return UI_1.UI.toastFail(res.errMsg, 2000); },
        });
    };
    /**
     * 数据有变化， 上一个页面需要刷新
     */
    Nav.refreshPre = function () {
        WX_1.WX.pagePre().subscribe(function (page) {
            page.onceRefresh = true;
        });
    };
    Nav.navBack = function (data) {
        var pages = getCurrentPages();
        var prePage = pages[pages.length - 2];
        if (prePage && prePage.holder) {
            // 需要等待上衣页面 onShow 后再传回参数, 否则后续页面的 modal 会在当前页面出现，然后跟随页面消失
            prePage.zzLife().filter(function (res) { return res === 'onShow'; }).take(1).subscribe(function () {
                var cb = prePage.holder.onResult;
                if (typeof cb === 'function') {
                    cb(data);
                }
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
    Nav.INDEX = '/pages/index/index';
    return Nav;
}());
exports.Nav = Nav;
var Route = /** @class */ (function () {
    function Route() {
    }
    Route.prototype.page = function () {
        var url = this.url;
        if (this.query) {
            url += "?" + this.query;
        }
        return url;
    };
    Route.create = function (path) {
        var route = new Route();
        route.url = this.checkUrl(path.split('?')[0]);
        route.query = path.split('?')[1] || '';
        return route;
    };
    Route.checkUrl = function (url) {
        if (/^(pages|package)/.test(url)) {
            url = "/" + url;
        }
        if (!/^\//.test(url)) {
            var currUrl = "/" + WX_1.WX.page().route;
            url = currUrl.substring(0, currUrl.lastIndexOf('/')) + "/" + url;
            url = url.replace(/[^/]+\/\.\.\//, '')
                .replace(/\/\//g, '/');
        }
        return url;
    };
    return Route;
}());
exports.Route = Route;
exports.NavInjectors = [];
function runQueue(queue, fn, cb) {
    var step = function (index) {
        if (index >= queue.length) {
            cb();
        }
        else if (queue[index]) {
            fn(queue[index], function () { return step(index + 1); });
        }
        else {
            step(index + 1);
        }
    };
    step(0);
}
exports.runQueue = runQueue;
//# sourceMappingURL=nav.js.map