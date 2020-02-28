"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
Component({
    data: {
        h: 0
    },
    attached: function () {
        var _this = this;
        wx.getSystemInfo({
            success: function (res) {
                _this.setData({ h: res.statusBarHeight });
            }
        });
    }
});
//# sourceMappingURL=index.js.map