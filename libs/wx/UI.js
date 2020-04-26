"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rx = require("../rx/Rx");
var UI = /** @class */ (function () {
    function UI() {
    }
    //<editor-fold desc="交互反馈">
    UI.showLoading = function (msgOrOptions) {
        if (msgOrOptions === void 0) { msgOrOptions = "加载中"; }
        var options;
        if (typeof msgOrOptions == 'object') {
            options = msgOrOptions;
        }
        else {
            options = {
                title: msgOrOptions
            };
        }
        options.mask = true;
        wx.showLoading(options);
    };
    UI.hideLoading = function () {
        wx.hideLoading();
    };
    UI.loading = function (show) {
        if (show === void 0) { show = false; }
        if (show) {
            wx.showLoading({ title: typeof show === "string" ? show : "加载中..." });
        }
        else {
            wx.hideLoading();
        }
    };
    UI.showToast = function (msgOrOptions) {
        var options = typeof msgOrOptions !== "object"
            ? { title: msgOrOptions + "" }
            : msgOrOptions;
        wx.showToast(options);
    };
    UI.hideToast = function () {
        wx.hideToast();
    };
    /** 不能通过点击遮罩消失 */
    UI.showModal = function (options) {
        if (typeof options.content == "object")
            options.content = JSON.stringify(options.content);
        if (!options.confirmColor)
            options.confirmColor = UI.colorPrimary;
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
        return Rx.Observable.create(function (sub) {
            behavor.subscribe(sub);
        });
    };
    /** 不能通过点击遮罩消失 */
    UI.showModalWithCancel = function (options) {
        if (typeof options.content == "object")
            options.content = JSON.stringify(options.content);
        if (!options.confirmColor)
            options.confirmColor = UI.colorPrimary;
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
    UI.alert = function (content, confirm, title) {
        if (confirm === void 0) { confirm = "确定"; }
        if (title === void 0) { title = "提示"; }
        UI.loading();
        if (typeof content == "object")
            content = JSON.stringify(content);
        var sub = new Rx.BehaviorSubject("ignore").filter(function (res) { return res == true; });
        UI.showModal({
            title: title,
            content: content,
            showCancel: false,
            confirmText: confirm,
            confirmColor: UI.colorPrimary,
            complete: function () {
                sub.next(true);
                sub.complete();
            }
        });
        return sub;
    };
    /** 不能通过点击遮罩消失 */
    UI.confirm = function (content, confirm, title) {
        if (confirm === void 0) { confirm = '确定'; }
        if (title === void 0) { title = "提示"; }
        if (typeof content == "object")
            content = JSON.stringify(content);
        return UI.showModal({
            title: title,
            content: content,
            confirmText: confirm,
            confirmColor: UI.colorPrimary
        });
    };
    /**
     * @param {Array<String>} items 按钮的文字数组，<font color=red>数组长度最大为 6 个</font>
     * @returns {Observable<number>} tapIndex
     */
    UI.showActionSheet = function (items) {
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
    UI.navColor = function (frontColor, bgColor) {
        wx.setNavigationBarColor({ frontColor: frontColor, backgroundColor: bgColor });
    };
    /**
     * 设置导航栏标题
     * @param title
     */
    UI.navTitle = function (title) {
        wx.setNavigationBarTitle({ title: title });
    };
    UI.navLoading = function (loading) {
        if (loading === void 0) { loading = true; }
        if (loading) {
            wx.showNavigationBarLoading();
        }
        else {
            wx.hideNavigationBarLoading();
        }
    };
    UI.navLoadingHandler = function (page, count) {
        var key = "netCount";
        if (!page[key])
            page[key] = 0;
        page[key] += count;
        if (page[key] < 0)
            page[key] = 0;
        this.navLoading(page[key] > 0);
    };
    UI.toastSuccess = function (msg, complete) {
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
    UI.toastFail = function (msg, duration) {
        if (duration === void 0) { duration = 1000; }
        if (typeof msg != "string")
            msg = JSON.stringify(msg);
        wx.showToast({
            title: msg,
            icon: 'none',
            duration: duration
        });
    };
    UI.colorPrimary = "#9A52D3";
    return UI;
}());
exports.UI = UI;
//# sourceMappingURL=UI.js.map