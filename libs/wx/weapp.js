"use strict";
exports.__esModule = true;
exports.HookPage = exports.PageInjectors = exports.HOOK_CONF = void 0;
var nav_1 = require("./nav");
var UI_1 = require("./UI");
var Data_1 = require("./Data");
var Rx_1 = require("../rx/Rx");
var mp_1 = require("../mp");
exports.HOOK_CONF = {
    log: true,
    shareUserIdKey: 'p'
};
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
    exports.PageInjectors.forEach(function (item) {
        if (item.init) {
            item.init(page);
        }
    });
    page.zzLife = function () {
        if (!this.__zzLife__) {
            this.__zzLife__ = new Rx_1.BehaviorSubject('onInit');
        }
        return this.__zzLife__;
    };
    page.onDataChange = new Rx_1.BehaviorSubject('');
    page.zzSetData = function () {
        this.setData.apply(this, arguments);
        page.onDataChange.next(arguments);
    };
    // 是否打印周期函数日志
    [
        'onLoad', 'onReady', 'onShow', 'onHide', 'onUnload',
        'onReachBottom', 'onPullDownRefresh', 'onPageScroll',
    ].forEach(function (method) {
        var native = page[method];
        page[method] = function () {
            var _this = this;
            page.zzLife.apply(this).next(method);
            if (method === 'onLoad') {
                this.options.scene = mp_1.WX.parsePageScene(this);
                this.setData({ options: this.options });
                this.navParams = nav_1.Nav.navData() || {};
                Object.keys(this.options).forEach(function (key) {
                    if (!_this.navParams.hasOwnProperty(key)) {
                        _this.navParams[key] = decodeURIComponent(_this.options[key]);
                    }
                });
                this.route = "/" + this.route;
                if (this.navTitle)
                    UI_1.UI.navTitle(this.navTitle);
            }
            if (method === 'onUnload') {
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
                catch (ignore) {
                }
            });
            if (exports.HOOK_CONF.log && method !== 'onPageScroll') {
                console.log(method, this.route, this.navTitle);
            }
        };
    });
    var shareMethod = 'onShareAppMessage';
    if (page[shareMethod]) {
        var native_1 = page[shareMethod];
        page[shareMethod] = function () {
            var _this = this;
            var message = native_1.apply(this, arguments);
            // 在分享链接后追加 p={userId}
            var userId = Data_1.Data.getUser().id;
            if (!message.path) {
                this.options[exports.HOOK_CONF.shareUserIdKey] = userId;
                var options = Object.keys(this.options).map(function (key) { return key + "=" + _this.options[key]; }).join('&');
                message.path = this.route + "?" + options;
            }
            else if (message.path.indexOf(exports.HOOK_CONF.shareUserIdKey + "=") === -1) {
                var separator = message.path.indexOf('?') === -1 ? '?' : '&';
                message.path += "" + separator + exports.HOOK_CONF.shareUserIdKey + "=" + userId;
            }
            console.log('onShareMessage', message);
            return message;
        };
    }
    Page(page);
}
exports.HookPage = HookPage;
/**
 * @version 20190328
 * @param page
 * @author Zeno Chan (zenochan@qq.com)
 */
function hookInputEvent(page) {
    // 伪双数据绑定
    var originInput = page.onInput;
    page.onInput = function (e) {
        var id = e.currentTarget.id;
        if (id) {
            var rootData = {};
            var node = rootData;
            var fields = id.split('.');
            if (fields.length > 1) {
                node = this.data[fields[0]] || {};
                rootData[fields[0]] = node;
                // 去头去尾取节点
                for (var i = 1; i < fields.length - 1; i++) {
                    node = node[fields[i]];
                }
            }
            // vant field 组件detail即value, value 为空时  {value:'' , cursor:0,keyCode:8}
            var value = e.detail;
            if (Object.prototype.hasOwnProperty.call(value, 'value')) {
                value = e.detail.value;
            }
            node[fields[fields.length - 1]] = value;
            if (e.detail.code) {
                node[id + "Code"] = e.detail.code;
            }
            this.setData(rootData);
        }
        if (typeof originInput === 'function') {
            originInput.apply(this, arguments);
        }
    };
    var originToggle = page.toggle;
    page.toggle = function (e) {
        var id = e.currentTarget.id;
        if (id) {
            var data = {};
            data[id] = !this.data[id];
            this.setData(data);
        }
        if (typeof originToggle === 'function') {
            originToggle.apply(this, arguments);
        }
    };
    page.clear = function (e) {
        var id = e.currentTarget.dataset.name;
        if (id) {
            var rootData = {};
            var node = rootData;
            var fields = id.split('.');
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
        if (typeof originInput === 'function') {
            originInput.apply(this, arguments);
        }
    };
    var originFocus = page.onFocus;
    page.onFocus = function (e) {
        this.setData({
            focus: e.currentTarget.id || null,
            keyboardHeight: e.detail.height
        });
        if (typeof originFocus === 'function') {
            originFocus.apply(this, arguments);
        }
    };
    page.view = function (e) {
        var options = {
            current: e.currentTarget.dataset.url,
            urls: e.currentTarget.dataset.urls
        };
        options = mp_1.API.completeImgUrl(options);
        wx.previewImage(options);
    };
    page.call = function (e) {
        var mobile = e.currentTarget.dataset.mobile;
        if (mobile) {
            wx.makePhoneCall({ phoneNumber: mobile });
        }
    };
    page.clearFocus = function () {
        var _this = this;
        this.setData({
            focus: null,
            hideKeyboard: true
        });
        setTimeout(function () {
            _this.setData({ hideKeyboard: false });
        }, 200);
    };
    // let originBlur = page.onBlur;
    // page.onBlur = function (e: WXEvent) {
    //   this.setData({focus: null});
    //   originBlur && originBlur.apply(this, arguments);
    // };
    var originBlur = page.onBlur;
    page.onBlur = function () {
        this.setData({ focus: null, keyboardHeight: 0 });
        if (typeof originBlur === 'function') {
            originBlur.apply(this, arguments);
        }
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
        if (typeof url === 'object') {
            data = url.currentTarget.dataset;
            url = url.currentTarget.dataset.url;
        }
        if (!url)
            return;
        url = url.toString();
        if (url.indexOf('tab:') === 0) {
            nav_1.Nav.switchTab(url.replace('tab:', ''));
        }
        else if (url) {
            nav_1.Nav.navForResult(this, url, data);
        }
    };
    page.replace = function (url) {
        wx.redirectTo({ url: url });
    };
}
exports.PageInjectors.push({
    onShow: function (page) {
        if (page.showed) {
            if (page.autoRefresh || page.onceRefresh) {
                page.onPullDownRefresh(); // 满足条件，刷新数据
                page.onceRefresh = false; // 重置刷新条件
            }
        }
        else {
            page.showed = true;
        }
        wx.hideNavigationBarLoading();
    }
});
// 注入 showModal, hideModal
exports.PageInjectors.push({
    onLoad: function (page) {
        page.showModal = function (event) {
            var target = typeof event === 'string' ? event : event.currentTarget.dataset.modal;
            var _a = page.data.modal, modal = _a === void 0 ? {} : _a;
            modal[target] = true;
            page.setData({ modal: modal });
            modal[target] = false;
        };
        page.hideModal = function (event) {
            var target = typeof event === 'string' ? event : event.currentTarget.dataset.modal;
            var _a = page.data.modal, modal = _a === void 0 ? {} : _a;
            modal[target] = false;
            page.setData({ modal: page.data.modal });
        };
    }
});
