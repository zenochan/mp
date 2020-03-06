"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WX_1 = require("../../wx/WX");
var Rx_1 = require("../../rx/Rx");
Component({
    data: { bodyHeight: 0 },
    properties: {
        below: { type: String, value: "" },
        above: { type: String, value: "" }
    },
    methods: {
        calcHeight: function () {
            var _this = this;
            Rx_1.Observable.zip(WX_1.WX.queryBoundingClientRect(this.data.below).map(function (res) { return res[0]; }), WX_1.WX.queryBoundingClientRect("#zz-scroll", this).map(function (res) { return res[0]; }), WX_1.WX.queryBoundingClientRect(this.data.above).map(function (res) { return res[0]; }), WX_1.WX.systemInfo()).subscribe(function (res) {
                var top = res[1].top;
                var bottom = res[3].windowHeight;
                if (res[0])
                    top = res[0].bottom;
                if (res[2])
                    bottom = res[2].top;
                var bodyHeight = bottom - top;
                var pre = _this.data.bodyHeight;
                if (bodyHeight != pre) {
                    _this.setData({ bodyHeight: bodyHeight });
                }
            });
        }
    },
    ready: function () {
        var _this = this;
        setInterval(function () { return _this.calcHeight(); }, 1000);
    }
});
//# sourceMappingURL=index.js.map