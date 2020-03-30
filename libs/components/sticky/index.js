"use strict";
exports.__esModule = true;
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
        this.sub = WX_1.WX.page().onDataChange.subscribe(function (res) {
            _this.init();
            setTimeout(function () { return _this.init(); }, 200);
        });
    },
    detached: function () {
        this.sub.unsubscribe();
    },
    ready: function () {
        this.init();
    },
});
