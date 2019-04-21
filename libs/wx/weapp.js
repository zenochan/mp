"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uikit_1 = require("./uikit");
var nav_1 = require("../nav");
var Data_1 = require("../Data");
exports.HOOK_CONF = { log: true };
exports.PageInjectors = [];
/**
 * 在 Page 的基础上加入周期函数 hook
 * 在 PageInjectors 中添加 PageHook
 * @param page
 * @constructor
 */
function HookPage(page) {
    if (page === void 0) { page = {}; }
    hookNav(page);
    hookInputEvent(page);
    // 是否打印周期函数日志
    ["onLoad", "onReady", "onShow", "onHide", "onUnload"].forEach(function (method) {
        var native = page[method];
        page[method] = function () {
            var _this = this;
            if (method == "onLoad") {
                this.navParams = nav_1.Nav.navData() || {};
                if (this.navTitle)
                    uikit_1.UIKit.navTitle(this.navTitle);
            }
            if (method == "onUnload") {
                // 微信 page 框架再 onUnload 周期之前不会调用 onHide，手动调用
                page.onHide.apply(this);
            }
            var args = arguments;
            if (native) {
                native.apply(this, arguments);
            }
            exports.PageInjectors.forEach(function (injector) {
                try {
                    var injectorMethod = injector[method];
                    injectorMethod && injectorMethod(_this, args);
                }
                catch (ignore) { }
            });
            exports.HOOK_CONF.log && console.log(method, this.route);
        };
    });
    var shareMethod = "onShareAppMessage";
    if (page[shareMethod]) {
        var native_1 = page[shareMethod];
        page[shareMethod] = function () {
            var _this = this;
            var message = native_1.apply(this, arguments);
            //在分享链接后追加 p={userId}
            var userId = Data_1.Data.getUser().id;
            if (!message.path) {
                this.options.p = userId;
                var options = Object.keys(this.options).map(function (key) { return key + "=" + _this.options[key]; }).join("&");
                message.path = this.route + "?" + options;
            }
            else if (message.path.indexOf("p=") == -1) {
                var separator = message.path.indexOf("?") == -1 ? '?' : '&';
                message.path += separator + "p=" + userId;
            }
            console.log("onShareMessage", message);
            return message;
        };
    }
    Page(page);
}
exports.HookPage = HookPage;
/**
 * @version 20190328
 * @param page
 * @author Zeno (zenochan@qq.com)
 */
function hookInputEvent(page) {
    // 伪双数据绑定
    var originInput = page.onInput;
    page['onInput'] = function (e) {
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
        originInput && originInput.apply(this, arguments);
    };
    var originToggle = page.toggle;
    page['toggle'] = function (e) {
        var id = e.currentTarget.id;
        if (id) {
            var data = {};
            data[id] = !this.data[id];
            this.setData(data);
        }
        originToggle && originToggle.apply(this, arguments);
    };
    page.clear = function (e) {
        var id = e.currentTarget.dataset.name;
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
            node[fields[fields.length - 1]] = null;
            this.setData(rootData);
        }
        originInput && originInput.apply(this, arguments);
    };
    var originFocus = page.onFocus;
    page.onFocus = function (e) {
        this.setData({ focus: e.currentTarget.id || null });
        originFocus && originFocus.apply(this, arguments);
    };
    page.view = function (e) {
        var _this = this;
        var url = e.currentTarget.dataset.url;
        var urls = e.currentTarget.dataset.urls;
        wx.previewImage({
            current: this.data.imgHost + url,
            urls: urls.map(function (url) { return _this.data.imgHost + url; })
        });
    };
    page.call = function (e) {
        var mobile = e.currentTarget.dataset.mobile;
        if (mobile) {
            wx.makePhoneCall({ phoneNumber: mobile });
        }
    };
    page.clearFocus = function (e) {
        var _this = this;
        this.setData({
            focus: null,
            hideKeyboard: true
        });
        setTimeout(function () {
            _this.setData({ hideKeyboard: false });
        }, 200);
    };
    var originBlur = page.onBlur;
    page.onBlur = function (e) {
        this.setData({ focus: null });
        originBlur && originBlur.apply(this, arguments);
    };
}
/**
 * @field replace
 *
 *
 * @param page
 * @since 2019-03-25
 * @version 2019-03-25
 * @author Zeno (zenochan@qq.com)
 */
function hookNav(page) {
    page.nav = function (url, data) {
        if (typeof url == "string") {
            nav_1.Nav.navForResult(this, url, data);
        }
        else if (typeof url == "object") {
            var dataUrl = url.currentTarget.dataset.url;
            dataUrl && nav_1.Nav.navForResult(this, dataUrl, url.currentTarget.dataset);
        }
    };
    page.replace = function (url) {
        wx.redirectTo({ url: url });
    };
}
//# sourceMappingURL=weapp.js.map