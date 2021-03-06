"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.sceneMap = exports.WX = void 0;
var Rx_1 = require("../rx/Rx");
var UI_1 = require("./UI");
var RxExt_1 = require("../rx/RxExt");
var Events_1 = require("./Events");
/**
 * 微信 API rx 封装
 *
 * # 开放接口
 */
var WX = /** @class */ (function () {
    function WX() {
    }
    WX.saveImageToPhotosAlbum = function (src, denied) {
        WX.authorize('scope.writePhotosAlbum')
            .flatMap(function () { return WX.getImageInfo(src); })
            .subscribe(function (res) {
            wx.saveImageToPhotosAlbum({
                filePath: res.path,
                success: function () { return UI_1.UI.toastSuccess('图片已保存'); }
            });
        }, function (e) {
            if ((e.errMsg || '').indexOf('authorize:fail') != -1) {
                denied();
            }
            else {
                UI_1.UI.toastFail(e);
            }
        });
    };
    WX.page = function () {
        var pages = getCurrentPages();
        return pages[pages.length - 1];
    };
    WX.pagePre = function () {
        var pages = getCurrentPages();
        if (pages.length > 1) {
            return RxExt_1.rxJust(pages[pages.length - 2]);
        }
        RxExt_1.rxEmpty();
    };
    WX.pagePrePath = function () {
        var pages = getCurrentPages();
        if (pages.length < 2) {
            return '';
        }
        return pages[pages.length - 2].route;
    };
    /**
     * 小程序强制更新
     * @param delayMs 延时弹框，安卓上有时候不显示
     */
    WX.forceUpdate = function (delayMs) {
        if (delayMs === void 0) { delayMs = 100; }
        if (delayMs < 0) {
            delayMs = 0;
        }
        wx.getUpdateManager().onUpdateReady(function () {
            setTimeout(function () {
                UI_1.UI.alert('需要重启小程序完成更新').subscribe(function (res) { return wx.getUpdateManager().applyUpdate(); });
            }, delayMs);
        });
    };
    /**
     * 是否是 iPhone X, 用于兼容底部导航, 底部添加 68rxp 高度;
     *
     * @see <a href="https://blog.csdn.net/weixin_39449961/article/details/80252895">微信小程序中的iPhone X适配问题</a>
     * @version 20190327
     * @author Zeno (zenochan@qq.com)
     */
    WX.isIphoneX = function () {
        return Rx_1.Observable.create(function (sub) { return wx.getSystemInfo({
            success: function (res) {
                sub.next(res.model.indexOf('iPhone X') != -1);
            },
            fail: function (e) { return sub.error(e); }
        }); });
    };
    WX.systemInfo = function () {
        return Rx_1.Observable.create(function (sub) { return wx.getSystemInfo({
            success: function (res) {
                var menuRounding = wx.getMenuButtonBoundingClientRect();
                res.navigationHeight = (menuRounding.top - res.statusBarHeight) * 2 + menuRounding.height;
                if (!res.safeArea) {
                    res.safeArea = {
                        paddingBottom: 0, left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0
                    };
                }
                res.safeArea.paddingBottom = res.screenHeight - res.safeArea.bottom;
                sub.next(res);
            },
            fail: function (e) { return sub.error(e); }
        }); });
    };
    WX.systemInfoSync = function () {
        var res = wx.getSystemInfoSync();
        var menuRounding = wx.getMenuButtonBoundingClientRect();
        res.navigationHeight = (menuRounding.top - res.statusBarHeight) * 2 + menuRounding.height;
        if (!res.safeArea) {
            res.safeArea = {
                paddingBottom: 0, left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0
            };
        }
        res.safeArea.paddingBottom = res.screenHeight - res.safeArea.bottom;
        return res;
    };
    /**
     * @deprecated use {@link systemInfo}
     */
    WX.navHeight = function () {
        return WX.systemInfo().map(function (res) {
            var menuRounding = wx.getMenuButtonBoundingClientRect();
            return (menuRounding.top - res.statusBarHeight) * 2 + menuRounding.height;
        });
    };
    WX.getLocation = function (options) {
        var _this = this;
        var isHighAccuracy = (options || {}).isHighAccuracy;
        return Rx_1.Observable.create(function (sub) { return wx.getLocation({
            type: 'gcj02',
            isHighAccuracy: isHighAccuracy,
            // altitude: true,
            success: function (res) { return sub.next(res); },
            fail: function (e) {
                if (e.errMsg.indexOf('auth') > 0) {
                    console.error('用户已拒绝定位授权');
                    Events_1.Events.publish(_this.EVENT_LOCATION_DENY, true);
                }
                else {
                    sub.error('获取定位失败，请检查微信是否有定位权限');
                }
            },
            complete: function () { return sub.complete(); }
        }); });
    };
    /**
     * 是否是 iPhone
     *
     * @see <a href="https://blog.csdn.net/weixin_39449961/article/details/80252895">微信小程序中的iPhone X适配问题</a>
     * @version 20190327
     * @author Zeno (zenochan@qq.com)
     */
    WX.isIphone = function () {
        return Rx_1.Observable.create(function (sub) { return wx.getSystemInfo({
            success: function (res) {
                sub.next(res.model.indexOf('iPhone') != -1);
            },
            fail: function (e) { return sub.error(e); }
        }); });
    };
    WX.onPageScroll = function (handler) {
        var pages = getCurrentPages();
        var page = pages[pages.length - 1];
        var origin = page.onPageScroll;
        page.onPageScroll = function (event) {
            origin && origin(event);
            handler(event.scrollTop);
        };
    };
    /**
     *  - The payload is invalid: 一定要在使用session_key 前调用wx.login, 否则解密消息时会此错误
     *
     * @param timeout {@link LoginOptions.timeout}
     * @see wx.login
     * @return code string
     */
    WX.login = function (timeout) {
        return Rx_1.Observable.create(function (emitter) {
            wx.login({
                timeout: timeout,
                success: function (res) { return emitter.next(res); },
                fail: function (error) { return emitter.error(error); },
                complete: function () { return emitter.complete(); }
            });
        }).map(function (res) { return res.code; });
    };
    WX.checkSession = function () {
        return Rx_1.Observable.create(function (emitter) {
            wx.checkSession({
                // session_key 未过期，并且在本生命周期一直有效
                success: function () { return emitter.next(true); },
                // session_key 已经失效，需要重新执行登录流程
                fail: function () { return emitter.next(false); },
                complete: function () { return emitter.complete(); }
            });
        });
    };
    /**
     * 扫码
     * @param scanType string[]  合法值
     *     - barCode  一维码
     *     - qrCode  二维码
     *     - datamatrix  Data Matrix 码
     *     - pdf417  PDF417 条码
     * @param onlyFromCamera
     */
    WX.scanCode = function (scanType, onlyFromCamera) {
        if (scanType === void 0) { scanType = ['qrCode']; }
        if (onlyFromCamera === void 0) { onlyFromCamera = true; }
        return Rx_1.Observable.create(function (emitter) {
            wx.scanCode({
                scanType: scanType,
                onlyFromCamera: onlyFromCamera,
                success: function (res) { return emitter.next(res); },
                fail: function (err) { return emitter.error(err); },
                complete: function () { return emitter.complete(); }
            });
        });
    };
    /**
     * @since v1.2.0
     * @see wx.getSetting
     */
    WX.getSetting = function () {
        return Rx_1.Observable.create(function (emitter) {
            wx.getSetting({
                success: function (res) { return emitter.next(res); },
                fail: function (error) { return emitter.error(error); },
                complete: function () { return emitter.complete(); }
            });
        }).map(function (res) {
            var authSetting = res.authSetting;
            return {
                userInfo: authSetting[WX.SCOPE.USER_INFO] || false,
                userLocation: authSetting[WX.SCOPE.USER_LOCATION] || false,
                address: authSetting[WX.SCOPE.ADDRESS] || false,
                invoiceTitle: authSetting[WX.SCOPE.INVOICE_TITLE] || false,
                werun: authSetting[WX.SCOPE.WE_RUN] || false,
                record: authSetting[WX.SCOPE.RECORD] || false,
                writePhotosAlbum: authSetting[WX.SCOPE.WRITE_PHOTOS_ALBUM] || false,
                camera: authSetting[WX.SCOPE.CAMERA] || false
            };
        });
    };
    WX.getUserInfo = function (lang) {
        if (lang === void 0) { lang = 'zh_CN'; }
        return Rx_1.Observable.create(function (emitter) {
            wx.getUserInfo({
                lang: lang,
                success: function (res) { return emitter.next(res); },
                fail: function (error) { return emitter.error(error); },
                complete: function () { return emitter.complete(); }
            });
        });
    };
    /**
     * https://developers.weixin.qq.com/miniprogram/dev/api/open-api/authorize/wx.authorize.html
     */
    WX.authorize = function (scope) {
        return Rx_1.Observable.create(function (emitter) {
            wx.authorize({
                scope: scope,
                success: function (res) { return emitter.next(res); },
                fail: function (error) { return emitter.error(error); },
                complete: function () { return emitter.complete(); }
            });
        });
    };
    WX.requestPayment = function (sign) {
        return Rx_1.Observable.create(function (emitter) {
            sign.success = function () { return emitter.next(); };
            sign.complete = function () { return emitter.complete(); };
            sign.fail = function (e) { return emitter.error(e.errMsg); };
            wx.requestPayment(sign);
        });
    };
    WX.chooseImage = function (count, sourceType) {
        if (count === void 0) { count = 1; }
        if (sourceType === void 0) { sourceType = ['camera', 'album']; }
        return Rx_1.Observable.create(function (sub) {
            wx.chooseImage({
                count: count,
                sourceType: sourceType,
                success: function (res) { return sub.next(res.tempFilePaths); },
                fail: function (e) {
                    // 忽略取消错误
                    if (e.errMsg.indexOf('cancel') === -1) {
                        sub.error(e);
                    }
                },
                complete: function () { return sub.complete(); }
            });
        });
    };
    WX.chooseVideo = function (count, sourceType) {
        if (count === void 0) { count = 1; }
        if (sourceType === void 0) { sourceType = ['camera', 'album']; }
        return Rx_1.Observable.create(function (sub) {
            wx.chooseVideo({
                sourceType: sourceType,
                success: function (res) { return sub.next(res); },
                fail: function (e) {
                    // 忽略取消错误
                    if (e.errMsg.indexOf('cancel') == -1) {
                        sub.error(e);
                    }
                },
                complete: function () { return sub.complete(); }
            });
        });
    };
    WX.chooseMedia = function (options) {
        var _a = options.count, count = _a === void 0 ? 1 : _a, _b = options.sourceType, sourceType = _b === void 0 ? ['camera', 'album'] : _b, _c = options.mediaType, mediaType = _c === void 0 ? ['image', 'video'] : _c;
        return Rx_1.Observable.create(function (sub) {
            var chooseOptions = {
                count: count,
                mediaType: mediaType,
                sourceType: sourceType,
                success: function (res) {
                    var files = res.tempFiles || [__assign(__assign({}, res), { fileType: 'video' })];
                    files.forEach(function (file) {
                        if (file.path) {
                            file.tempFilePath = file.path;
                            delete file.path;
                        }
                        if (!Object.prototype.hasOwnProperty.call(file, 'fileType')) {
                            file.fileType = 'image';
                        }
                    });
                    sub.next(files);
                },
                fail: function (e) {
                    // 忽略取消错误
                    if (e.errMsg.indexOf('cancel') === -1) {
                        sub.error(e);
                    }
                },
                complete: function () { return sub.complete(); }
            };
            if (wx.chooseMedia) { // 2.10.0
                wx.chooseMedia(chooseOptions);
            }
            else if (mediaType.length === 2) {
                UI_1.UI.showActionSheet(['拍图片', '拍视频', '从相册选择图片', '从相册选择视频']).subscribe(function (index) {
                    switch (index) {
                        case 0:
                            wx.chooseImage(__assign(__assign({}, chooseOptions), { sourceType: ['camera'] }));
                            break;
                        case 1:
                            wx.chooseVideo(__assign(__assign({}, chooseOptions), { sourceType: ['camera'] }));
                            break;
                        case 2:
                            wx.chooseImage(__assign(__assign({}, chooseOptions), { sourceType: ['album'] }));
                            break;
                        default:
                            wx.chooseVideo(__assign(__assign({}, chooseOptions), { sourceType: ['album'] }));
                            break;
                    }
                });
            }
            else if (mediaType[0] === 'video') {
                wx.chooseVideo(chooseOptions);
            }
            else {
                wx.chooseImage(chooseOptions);
            }
        });
    };
    /**
     * @see [wx.updateShareMenu](https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.updateShareMenu.html)
     */
    WX.updateShareMenu = function (withShareTicket) {
        return Rx_1.Observable.create(function (sub) {
            wx.updateShareMenu({
                withShareTicket: withShareTicket,
                success: function (res) { return sub.next(res); },
                fail: function (e) { return sub.error(e); },
                complete: function () { return sub.complete(); }
            });
        });
    };
    /**
     * @see [wx.showShareMenu](https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.showShareMenu.html)
     * @since 1.1.0
     */
    WX.showShareMenu = function (withShareTicket) {
        if (withShareTicket === void 0) { withShareTicket = false; }
        var sub = new Rx_1.BehaviorSubject().filter(function (res) { return res; });
        wx.showShareMenu({
            withShareTicket: withShareTicket,
            success: function (res) { return sub.next(res); },
            fail: function (e) { return sub.error(e); },
            complete: function () { return sub.complete(); }
        });
        return sub;
    };
    WX.showActionSheet = function (items, color) {
        if (color === void 0) { color = '#000000'; }
        return Rx_1.Observable.create(function (sub) {
            wx.showActionSheet({
                itemList: items,
                itemColor: color,
                success: function (res) { return sub.next(res); },
                fail: function (e) { return sub.error(e); },
                complete: function () { return sub.complete(); }
            });
        });
    };
    /**
     * @see [wx.hideShareMenu](https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.hideShareMenu.html)
     * @since 1.1.0
     */
    WX.hideShareMenu = function () {
        var subject = new Rx_1.BehaviorSubject().filter(function (res) { return res; });
        wx.hideShareMenu({
            success: function (res) { return subject.next(res); },
            fail: function (e) { return subject.error(e); },
            complete: function () { return subject.complete(); }
        });
        return subject;
    };
    /**
     * @param shareTicket
     * @param timeout since 1.9.90
     * @see [wx.getShareInfo](https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.getShareInfo.html)
     */
    WX.getShareInfo = function (shareTicket, timeout) {
        if (timeout === void 0) { timeout = 5000; }
        return Rx_1.Observable.create(function (sub) {
            wx.getShareInfo({
                shareTicket: shareTicket,
                timeout: timeout,
                success: function (res) { return sub.next(res); },
                fail: function (e) { return sub.error(e); },
                complete: function () { return sub.complete(); }
            });
        });
    };
    /**
     * 获取图片信息。网络图片需先配置download域名才能生效。
     *
     * 如果是本地图片,即'static'文件夹中的图片，
     * 如'/static/logo.png'经过wx.getImageInfo返回的path会省去开头的'/'，
     * 即'static/logo.png'，这会导致拿不到资源，
     * 所以本地图片不需要调用wx.getImageInfo()进行本地缓存
     * @param src
     */
    WX.getImageInfo = function (src) {
        return Rx_1.Observable.create(function (sub) {
            wx.getImageInfo({
                src: src,
                success: function (res) { return sub.next(res); },
                fail: function (e) { return sub.error(e); }
            });
        });
    };
    WX.canvasToTempFilePath = function (options) {
        return Rx_1.Observable.create(function (sub) {
            options.success = function (res) { return sub.next(res.tempFilePath); };
            options.fail = function (e) { return sub.error(e); };
            options.complete = function () { return sub.complete(); };
            wx.canvasToTempFilePath(options);
        });
    };
    WX.parsePageScene = function (page) {
        var sceneObj = {};
        try {
            var scene = decodeURIComponent(page.options.scene || '');
            sceneObj.origin = scene;
            if (scene.includes('=')) {
                scene.split('&')
                    .filter(function (kv) { return /^[^=]+=[^=]+$/.test(kv); })
                    .forEach(function (kv) {
                    var kvArray = kv.split('=');
                    sceneObj[kvArray[0]] = kvArray[1];
                });
            }
        }
        catch (e) {
        }
        return sceneObj;
    };
    /**
     * 跳转小程序/小游戏
     * @param appId
     */
    WX.navWeapp = function (appId) {
        wx.navigateToMiniProgram({ appId: appId });
    };
    /**
     * @param selector
     * @param comp
     * @version 20190326
     * @author Zeno (zenochan@qq.com)
     */
    WX.queryBoundingClientRect = function (selector, comp) {
        return Rx_1.Observable.create(function (sub) {
            var query = comp ? comp.createSelectorQuery() : wx.createSelectorQuery();
            query.selectAll(selector).boundingClientRect();
            query.exec(function (elements) {
                sub.next(elements[0]);
            });
        });
    };
    /**
     * @param selector
     * @param comp
     * @version 20190326
     * @author ZenoToken (zenochan@qq.com)
     */
    WX.size = function (selector, comp) {
        return Rx_1.Observable.create(function (sub) {
            var query = (comp || wx).createSelectorQuery();
            query.select(selector).boundingClientRect();
            query.exec(function (elements) {
                var el = elements[0];
                el && sub.next({ width: el.right - el.left, height: el.bottom - el.top });
                sub.complete();
            });
        });
    };
    WX.clipboard = function (data) {
        return this.rx(function (handler) {
            handler.data = data;
            wx.setClipboardData(handler);
        });
    };
    WX.rx = function (handler) {
        var options = {};
        return Rx_1.Observable.create(function (sub) {
            options.complete = function () { return sub.complete(); };
            options.success = function (res) { return sub.next(res); };
            options.fail = function (err) { return sub.error(err); };
            handler(options);
        });
    };
    /**
     * @see Scope
     */
    WX.SCOPE = {
        USER_INFO: 'scope.userInfo',
        USER_LOCATION: 'scope.userLocation',
        ADDRESS: 'scope.address',
        INVOICE_TITLE: 'scope.invoiceTitle',
        WE_RUN: 'scope.werun',
        RECORD: 'scope.record',
        WRITE_PHOTOS_ALBUM: 'scope.writePhotosAlbum',
        CAMERA: 'scope.camera'
    };
    WX.EVENT_LOCATION_DENY = 'deny:location';
    return WX;
}());
exports.WX = WX;
wx.sceneName = function (scene) { return exports.sceneMap[scene]; };
exports.sceneMap = {
    1001: '发现栏小程序主入口',
    1005: '顶部搜索框的搜索结果页',
    1006: '发现栏小程序主入口搜索框的搜索结果页',
    1007: '单人聊天会话中的小程序消息卡片',
    1008: '群聊会话中的小程序消息卡片',
    1011: '扫描二维码',
    1012: '长按图片识别二维码',
    1013: '手机相册选取二维码',
    1014: '小程序模版消息',
    1017: '前往体验版的入口页',
    1019: '微信钱包',
    1020: '公众号 profile 页相关小程序列表',
    1022: '聊天顶部置顶小程序入口',
    1023: '安卓系统桌面图标',
    1024: '小程序 profile 页',
    1025: '扫描一维码',
    1028: '我的卡包',
    1029: '卡券详情页',
    1031: '长按图片识别一维码',
    1032: '手机相册选取一维码',
    1034: '微信支付完成页',
    1035: '公众号自定义菜单',
    1036: 'App 分享消息卡片',
    1042: '添加好友搜索框的搜索结果页',
    1043: '公众号模板消息',
    1044: '群聊会话中的小程序消息卡片（带 shareTicket）',
    1047: '扫描小程序码',
    1048: '长按图片识别小程序码',
    1049: '手机相册选取小程序码'
};
