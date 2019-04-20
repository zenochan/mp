"use strict";
exports.__esModule = true;
var uikit_1 = require("../uikit");
var nav_1 = require("../nav");
var weapp_1 = require("../weapp");
var Data_1 = require("../Data");
/**
 * onLoad -> onShow [-> onReady] -> onHide [-> onUnload]
 */
var BasePage = /** @class */ (function () {
    function BasePage() {
        this.options = {};
        this.ready = false;
    }
    Object.defineProperty(BasePage.prototype, "navTitle", {
        // @ts-ignore
        get: function () {
            return this._title;
        },
        // @ts-ignore
        set: function (text) {
            this._title = text;
            if (this.ready)
                uikit_1.UIKit.navTitle(this._title);
        },
        enumerable: true,
        configurable: true
    });
    BasePage.prototype.getData = function (page) {
        if (page === void 0) { page = 1; }
        wx.stopPullDownRefresh();
    };
    BasePage.prototype.onPullDownRefresh = function () {
        if (this.data && this.data.page)
            this.getData();
    };
    BasePage.prototype.onReachBottom = function () {
        if (this.data && this.data.page) {
            this.getData(this.data.page.current_page + 1);
        }
    };
    //<editor-fold desc="life circle">
    BasePage.prototype.onLoad = function (options) {
        this.injectors('onLoad', arguments);
        this.navParams = nav_1.Nav.navData() || {};
        this._title && uikit_1.UIKit.navTitle(this._title);
    };
    BasePage.prototype.onUnload = function () {
        this.onHide();
        this.injectors('onUnload', arguments);
    };
    BasePage.prototype.onShow = function () {
        this.injectors('onShow', arguments);
    };
    BasePage.prototype.onHide = function () {
        this.injectors('onHide', arguments);
    };
    BasePage.prototype.onReady = function () {
        this.ready = true;
        this.injectors('onReady', arguments);
    };
    //</editor-fold>
    //<editor-fold desc="input">
    // 伪双数据绑定
    BasePage.prototype.onInput = function (e) {
        var id = e.currentTarget.id;
        if (id) {
            var rootData = {};
            var node = rootData;
            var fields = id.split(".");
            if (fields.length > 1) {
                node = this.data[fields[0]] || {};
                rootData[fields[0]] = node;
                // 去头去尾取节点
                for (var i = 1; i < fields.length - 1; i++) {
                    node = node[fields[i]];
                }
            }
            node[fields[fields.length - 1]] = e.detail.value;
            if (e.detail.code) {
                node[id + "Code"] = e.detail.code;
            }
            this.setData(rootData);
        }
    };
    ;
    BasePage.prototype.onFocus = function (e) {
        this.setData({ focus: e.currentTarget.id || null });
    };
    ;
    BasePage.prototype.onBlur = function (e) {
        this.setData({ focus: null });
    };
    ;
    BasePage.prototype.onConfirm = function (e) { };
    //</editor-fold>
    //<editor-fold desc="wx open">
    /**
     * 图片预览
     * - data-url 当前url
     * - data-urls 所有图片url
     * @param e
     */
    BasePage.prototype.view = function (e) {
        var _this = this;
        var url = e.currentTarget.dataset.url;
        var urls = e.currentTarget.dataset.urls;
        wx.previewImage({
            current: this.data.imgHost + url,
            urls: urls.map(function (url) { return _this.data.imgHost + url; })
        });
    };
    ;
    /**
     * 呼叫
     * @param e
     */
    BasePage.prototype.call = function (e) {
        var mobile = e.currentTarget.dataset.mobile;
        if (mobile) {
            wx.makePhoneCall({ phoneNumber: mobile });
        }
    };
    ;
    //</editor-fold>
    //<editor-fold desc="navgator">
    /**
     * @field replace
     *
     * @since 2019-03-25
     * @version 2019-03-25
     * @author Zeno (zenochan@qq.com)
     */
    BasePage.prototype.nav = function (url, data) {
        if (typeof url == "string") {
            return nav_1.Nav.navForResult(this, url, data);
        }
        else if (typeof url == "object") {
            var dataUrl = url.currentTarget.dataset.url;
            if (dataUrl) {
                return nav_1.Nav.navForResult(this, dataUrl, url.currentTarget.dataset);
            }
        }
    };
    ;
    BasePage.prototype.redirectTo = function (url, data) {
        wx.redirectTo({ url: url });
    };
    //</editor-fold>
    BasePage.prototype.injectors = function (method, args) {
        var _this = this;
        weapp_1.HOOK_CONF.log && console.log(method, this.route);
        weapp_1.PageInjectors.forEach(function (injector) {
            try {
                var injectorMethod = injector[method];
                injectorMethod && injectorMethod.apply(void 0, [_this].concat(args));
            }
            catch (ignore) { }
        });
    };
    /**
     * 分享 hook, 添加 uid
     * @param options
     * @private
     */
    BasePage.prototype._onShareAppMessage = function (options) {
        var _this = this;
        var message = options || {};
        //在分享链接后追加 p={userId}
        var userId = Data_1.Data.getUser().id;
        if (!message.path) {
            this.options.uid = userId;
            var options_1 = Object.keys(this.options).map(function (key) { return key + "=" + _this.options[key]; }).join("&");
            message.path = this.route + "?" + options_1;
        }
        else if (message.path.indexOf("uid=") == -1) {
            var separator = message.path.indexOf("?") == -1 ? '?' : '&';
            message.path += separator + "uid=" + userId;
        }
        weapp_1.HOOK_CONF.log && console.info("onShare", message);
        return message;
    };
    BasePage.page = function () {
        // Cannot assign to read only property 'constructor'
        // https://github.com/Microsoft/TypeScript/issues/6887
        this.prototype = Object.create(this.prototype, { constructor: { value: this, writable: true } });
        var page = new this();
        var share = "onShareAppMessage";
        var origin = page[share];
        page[share] = function () {
            page["_" + share].apply(this, origin());
        };
        Page(page);
    };
    return BasePage;
}());
exports.BasePage = BasePage;
//# sourceMappingURL=Page.js.map