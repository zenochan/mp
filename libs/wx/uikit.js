"use strict";
exports.__esModule = true;
var Rx = require("./rxjs-wx/Rx");
var Rx_1 = require("./rxjs-wx/Rx");
var UIKit = /** @class */ (function () {
    function UIKit() {
    }
    //<editor-fold desc="交互反馈">
    UIKit.showLoading = function (msgOrOptions) {
        if (msgOrOptions === void 0) { msgOrOptions = "加载中"; }
        wx.showLoading(typeof msgOrOptions === "string"
            ? { title: msgOrOptions }
            : msgOrOptions);
    };
    UIKit.hideLoading = function () {
        wx.hideLoading();
    };
    UIKit.loading = function (show) {
        if (show === void 0) { show = false; }
        if (show) {
            wx.showLoading({ title: typeof show === "string" ? show : "加载中..." });
        }
        else {
            wx.hideLoading();
        }
    };
    UIKit.showToast = function (msgOrOptions) {
        var options = typeof msgOrOptions !== "object"
            ? { title: msgOrOptions + "" }
            : msgOrOptions;
        wx.showToast(options);
    };
    UIKit.hideToast = function () {
        wx.hideToast();
    };
    /** 不能通过点击遮罩消失 */
    UIKit.showModal = function (options) {
        if (typeof options.content == "object")
            options.content = JSON.stringify(options.content);
        if (!options.confirmColor)
            options.confirmColor = UIKit.colorPrimary;
        var behavor = new Rx.BehaviorSubject("ignore").filter(function (res) { return res == true; });
        options.success = function (res) {
            if (res.confirm)
                behavor.next(true);
            if (res.cancel)
                behavor.next(false);
            behavor.complete();
        };
        options.fail = function (res) {
            console.error(res);
            behavor.error(res.errMsg);
        };
        wx.showModal(options);
        return Rx_1.Observable.create(function (sub) {
            behavor.subscribe(sub);
        });
    };
    /** 不能通过点击遮罩消失 */
    UIKit.showModalWithCancel = function (options) {
        if (typeof options.content == "object")
            options.content = JSON.stringify(options.content);
        if (!options.confirmColor)
            options.confirmColor = UIKit.colorPrimary;
        var sub = new Rx.BehaviorSubject("ignore").filter(function (res) { return res != "ignore"; });
        options.success = function (res) {
            if (res.confirm)
                sub.next(true);
            if (res.cancel)
                sub.next(false);
            sub.complete();
        };
        options.fail = function (res) { return sub.error(res.errMsg); };
        wx.showModal(options);
        return sub;
    };
    /** 不能通过点击遮罩消失 */
    UIKit.alert = function (content, confirm, title) {
        if (confirm === void 0) { confirm = "确定"; }
        if (title === void 0) { title = "提示"; }
        UIKit.loading();
        if (typeof content == "object")
            content = JSON.stringify(content);
        var sub = new Rx.BehaviorSubject("ignore").filter(function (res) { return res == true; });
        UIKit.showModal({
            title: title,
            content: content,
            showCancel: false,
            confirmText: confirm,
            confirmColor: UIKit.colorPrimary,
            complete: function () {
                sub.next(true);
                sub.complete();
            }
        });
        return sub;
    };
    /** 不能通过点击遮罩消失 */
    UIKit.confirm = function (content, confirm, title) {
        if (title === void 0) { title = "提示"; }
        if (typeof content == "object")
            content = JSON.stringify(content);
        return UIKit.showModal({
            title: title,
            content: content,
            confirmText: confirm,
            confirmColor: UIKit.colorPrimary
        });
    };
    /**
     * @param {Array<String>} items 按钮的文字数组，<font color=red>数组长度最大为 6 个</font>
     * @returns {Observable<number>} tapIndex
     */
    UIKit.showActionSheet = function (items) {
        return Rx.Observable.create(function (sub) {
            wx.showActionSheet({
                itemList: items,
                success: function (res) {
                    sub.next(res.tapIndex);
                    sub.complete();
                },
                fail: function (res) { return sub.error(res.errMsg); }
            });
        });
    };
    //</editor-fold>
    /**
     * @param {"#ffffff" | "#000000"} frontColor 导航栏前景色，包括标题，按钮, 状态栏
     * @param {String} bgColor 导航栏背景色
     */
    UIKit.navColor = function (frontColor, bgColor) {
        wx.setNavigationBarColor({ frontColor: frontColor, backgroundColor: bgColor });
    };
    /**
     * 设置导航栏标题
     * @param title
     */
    UIKit.navTitle = function (title) {
        wx.setNavigationBarTitle({ title: title });
    };
    UIKit.navLoading = function (loading) {
        if (loading === void 0) { loading = true; }
        if (loading) {
            wx.showNavigationBarLoading();
        }
        else {
            wx.hideNavigationBarLoading();
        }
    };
    UIKit.navLoadingHandler = function (page, count) {
        var key = "netCount";
        if (!page[key])
            page[key] = 0;
        page[key] += count;
        if (page[key] < 0)
            page[key] = 0;
        this.navLoading(page[key] > 0);
    };
    UIKit.toastSuccess = function (msg, complete) {
        if (complete === void 0) { complete = function () { }; }
        if (typeof msg != "string")
            msg = JSON.stringify(msg);
        wx.showToast({
            title: msg,
            icon: 'success',
            duration: 1000,
            complete: function () { return complete(); }
        });
    };
    UIKit.toastFail = function (msg, duration) {
        if (duration === void 0) { duration = 1000; }
        if (typeof msg != "string")
            msg = JSON.stringify(msg);
        wx.showToast({
            title: msg,
            icon: 'none',
            duration: duration
        });
    };
    UIKit.colorPrimary = "#9A52D3";
    return UIKit;
}());
exports.UIKit = UIKit;
//# sourceMappingURL=uikit.js.map