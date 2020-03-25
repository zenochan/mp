"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WX_1 = require("../../wx/WX");
var Rx_1 = require("../../rx/Rx");
var mp_1 = require("../../mp");
Component({
    data: { bodyHeight: 0 },
    properties: {
        below: { type: String, value: "" },
        above: { type: String, value: "" }
    },
    methods: {
        calcHeight: function () {
            var _this = this;
            wx.pageScrollTo({ scrollTop: 0 });
            var below = this.data.below ? WX_1.WX.queryBoundingClientRect(this.data.below).map(function (res) { return res[0]; }) : mp_1.rxJust(null);
            var above = this.data.above ? WX_1.WX.queryBoundingClientRect(this.data.above).map(function (res) { return res[0]; }) : mp_1.rxJust(null);
            Rx_1.Observable.zip(below, WX_1.WX.queryBoundingClientRect("#zz-scroll", this).map(function (res) { return res[0]; }), above).subscribe(function (res) {
                var top = res[1].top;
                var bottom = _this.data.windowHeight;
                if (res[0])
                    top = res[0].bottom;
                if (res[2])
                    bottom = res[2].top;
                var bodyHeight = bottom - top;
                if (bodyHeight != _this.data.bodyHeight) {
                    _this.setData({ bodyHeight: bodyHeight });
                }
            });
        }
    },
    ready: function () {
        var _this = this;
        WX_1.WX.systemInfo().subscribe(function (res) {
            _this.data.windowHeight = res.windowHeight;
            _this.calcHeight();
            WX_1.WX.page().onDataChange.subscribe(function (res) {
                _this.calcHeight();
                setTimeout(function () { return _this.calcHeight(); }, 200);
            });
        });
    },
});
//# sourceMappingURL=index.js.map