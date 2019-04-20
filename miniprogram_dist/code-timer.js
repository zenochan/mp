"use strict";
exports.__esModule = true;
var Events_1 = require("./Events");
var CodeTimer = /** @class */ (function () {
    /**
     *
     * @param type
     * @param during 等待间隔(s)，默认60
     */
    function CodeTimer(type, during) {
        if (type === void 0) { type = "code"; }
        if (during === void 0) { during = 60; }
        this.type = type;
        this.during = during;
        this.wait = 0;
        this.timer = null;
        var wait = wx.getStorageSync(this.key());
        if (!wait)
            return;
        var remain = (wait - new Date().getTime()) / 1000 | 0;
        if (remain > 0) {
            this.wait = remain;
            this.intoWait();
        }
    }
    // 进入等待
    CodeTimer.prototype.intoWait = function () {
        var _this = this;
        if (this.wait == 0)
            this.wait = this.during;
        this.timer = setTimeout(function () {
            _this.wait--;
            if (_this.wait > 0) {
                _this.intoWait();
                Events_1.Events.publish(_this.key(), _this);
            }
            else {
                Events_1.Events.publish(_this.key(), _this);
            }
        }, 1000);
    };
    /**
     * 在 ionWillUnload 方法中调用
     */
    CodeTimer.prototype.saveStatus = function () {
        wx.setStorageSync(this.key(), Date.now() + this.wait * 1000);
        clearTimeout(this.timer);
    };
    CodeTimer.prototype.key = function () {
        return "code:wait:" + this.type;
    };
    return CodeTimer;
}());
exports.CodeTimer = CodeTimer;
//# sourceMappingURL=code-timer.js.map