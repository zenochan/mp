"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WX_1 = require("../../WX");
Component({
    data: {
        showTop: false // 是否显示
    },
    methods: {
        scrollTop: function () {
            wx.pageScrollTo({ scrollTop: 0 });
        }
    },
    properties: {
        top: { type: Number, value: 1000 }
    },
    attached: function () {
        var _this = this;
        WX_1.WX.onPageScroll(function (top) {
            var hold = _this.data.top;
            if (top > hold && !_this.data.showTop) {
                _this.setData({ showTop: true });
            }
            else if (top < hold && _this.data.showTop) {
                _this.setData({ showTop: false });
            }
        });
    }
});
//# sourceMappingURL=scroll-top.js.map