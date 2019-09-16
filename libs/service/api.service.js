"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Data_1 = require("../wx/Data");
var Rx_1 = require("../rx/Rx");
var UI_1 = require("../wx/UI");
/**
 * ## Methods
 * - {@link get}
 * - {@link post}
 * - {@link put}
 * - {@link delete}
 */
var API = /** @class */ (function () {
    function API() {
    }
    API.config = function (config) {
        this.API_BASE = config.host;
        this.IMG_BASE = config.imgBase;
        this.resHandler = config.resHandler;
        this.headerInterceptor = config.headerInterceptor;
        this.pathInterceptor = config.pathInterceptor;
    };
    API.get = function (url, query) {
        if (query === void 0) { query = null; }
        url = this.query(url, query);
        url = API.pathVariable(url, query);
        return this.buildRequest({ method: "GET", url: this.API_BASE + url });
    };
    API.post = function (url, param) {
        if (param === void 0) { param = {}; }
        param = this.simpleImgUrl(param);
        url = API.pathVariable(url, param);
        return this.buildRequest({ method: "POST", url: this.API_BASE + url, data: param });
    };
    API.put = function (url, param) {
        if (param === void 0) { param = {}; }
        param = this.simpleImgUrl(param);
        url = API.pathVariable(url, param);
        return this.buildRequest({ method: "PUT", url: this.API_BASE + url, data: param });
    };
    API.delete = function (url) {
        return this.buildRequest({ method: "DELETE", url: this.API_BASE + url });
    };
    API.upload = function (filePath, form) {
        var _this = this;
        if (form === void 0) { form = {}; }
        var url = this.API_BASE + "upload";
        if (this.pathInterceptor)
            url = this.pathInterceptor(url);
        return Rx_1.Observable.create(function (sub) {
            wx.uploadFile({
                url: url,
                filePath: filePath,
                header: _this.tokenHeader(),
                name: "photo",
                formData: form,
                success: function (res) {
                    var data = JSON.parse(res.data);
                    _this.handlerRes({ statusCode: 200, data: data }, sub);
                },
                fail: function (e) { return sub.error(e); },
                complete: function () { return sub.complete(); }
            });
        });
    };
    API.uploadMore = function (filePaths) {
        var _this = this;
        var url = this.API_BASE + "upload";
        if (this.pathInterceptor)
            url = this.pathInterceptor(url);
        // 上传图片必须 https 请求，这里都直接用 prod 环境
        return Rx_1.Observable.create(function (sub) {
            var urls = [];
            var completed = 0;
            filePaths.forEach(function (item) {
                wx.uploadFile({
                    url: url,
                    filePath: item,
                    name: "photo",
                    header: _this.tokenHeader(),
                    success: function (res) {
                        var data = JSON.parse(res.data);
                        urls.push(data.filename);
                    },
                    fail: function (e) { return console.error(e); },
                    complete: function () {
                        completed++;
                        if (completed == filePaths.length) {
                            sub.next(_this.completeImgUrl(urls));
                            sub.complete();
                        }
                    }
                });
            });
        });
    };
    // 补全 url 连接
    API.completeImgUrl = function (data) {
        var _this = this;
        var dataString = JSON.stringify(data).replace(/"([^"]+.(png|jpg|jpeg))"/g, function (reg, a) {
            if (a.indexOf('http') == -1)
                a = _this.IMG_BASE + a;
            return "\"" + a + "\"";
        });
        return JSON.parse(dataString);
    };
    // 简化 url 连接, 上传数据时不保留图片基础链接
    API.simpleImgUrl = function (data) {
        var reg = new RegExp(this.IMG_BASE, 'g');
        var dataString = JSON.stringify(data).replace(reg, '');
        return JSON.parse(dataString);
    };
    API.requestComplete = function () {
        this.counter--;
        if (this.counter <= 0) {
            wx.hideNavigationBarLoading();
            wx.stopPullDownRefresh();
        }
    };
    API.handlerRes = function (res, sub) {
        if (this.resHandler) {
            this.resHandler(res, sub);
        }
        else {
            var data_1 = res.data;
            if (res.statusCode < 300) {
                sub.next(this.completeImgUrl(data_1));
            }
            else if (res.statusCode == 401) {
                // 授权失败, 重启小程序
                Data_1.Data.clear();
                UI_1.UI.alert("登录已失效").subscribe(function (res) { return wx.reLaunch({ url: "/pages/account/login/login" }); });
            }
            else if (data_1.errors) {
                var err = Object.keys(data_1.errors).map(function (key) { return data_1.errors[key]; }).map(function (errorItem) { return errorItem.join(","); }).join(",");
                sub.error(err);
            }
            else {
                sub.error((data_1 || {}).message || "网络请求失败");
            }
        }
    };
    API.buildRequest = function (options) {
        var _this = this;
        if (this.pathInterceptor)
            options.url = this.pathInterceptor(options.url);
        options.header = this.tokenHeader();
        this.counter++;
        wx.showNavigationBarLoading();
        return Rx_1.Observable.create(function (sub) {
            // build callback
            options.success = function (res) { return _this.handlerRes(res, sub); };
            options.fail = function (e) { return sub.error("网络请求失败"); };
            options.complete = function () {
                sub.complete();
                _this.requestComplete();
            };
            var task = wx.request(options);
            // 返回取消订阅的操作句柄
            return function () { task && task.abort(); };
        });
    };
    API.pathVariable = function (url, param) {
        Object.keys(param || {}).forEach(function (key) {
            if (url.indexOf(":" + key) != -1) {
                // rest api
                url = url.replace(":" + key, param[key]);
            }
        });
        return url;
    };
    API.query = function (url, param) {
        Object.keys(param || {}).forEach(function (key) {
            url += (url.indexOf('?') == -1 ? '?' : "&") + key + '=' + param[key];
        });
        return url;
    };
    API.tokenHeader = function (origin) {
        if (origin === void 0) { origin = {}; }
        if (this.headerInterceptor) {
            return this.headerInterceptor({});
        }
    };
    API.counter = 0;
    API.API_BASE = "";
    API.IMG_BASE = "";
    API.resHandler = null;
    API.headerInterceptor = null;
    API.pathInterceptor = null;
    return API;
}());
exports.API = API;
//# sourceMappingURL=api.service.js.map