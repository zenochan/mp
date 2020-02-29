"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WX_1 = require("../../wx/WX");
Component({
    data: {
        top: 0,
        offset: 0,
        sticky: false
    },
    options: {
        addGlobalClass: true
    },
    properties: {
        data: {
            type: Array, value: null, observer: function () {
                this.init();
            }
        },
        offset: { type: Number, value: 0 }
    },
    methods: {
        init: function () {
            var _this = this;
            WX_1.WX.queryBoundingClientRect(".body", this).subscribe(function (res) {
                _this.setData({
                    top: res[0].top,
                    height: res[0].bottom - res[0].top
                });
            });
        }
    },
    attached: function () {
        var _this = this;
        WX_1.WX.onPageScroll(function (top) {
            top += _this.data.offset;
            !_this.data.sticky && _this.data.top < top && _this.setData({ sticky: true });
            _this.data.sticky && _this.data.top > top && _this.setData({ sticky: false });
        });
    },
    ready: function () {
        this.init();
    },
});
//# sourceMappingURL=sticky.js.map