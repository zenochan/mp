"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 兼容 iPhoneX 底部导航
 */
var WX_1 = require("../../wx/WX");
Component({
    attached: function () {
        var _this = this;
        WX_1.WX.isIphoneX().subscribe(function (res) { return _this.setData({ paddingBottom: res ? 68 : 0 }); });
    },
    properties: {
        inTabs: { type: Boolean, value: false },
        bgColor: { type: String, value: "#F7F7F7" }
    },
    ready: function () {
        var _this = this;
        // @ts-ignore
        WX_1.WX.queryBoundingClientRect(".fixed", this).retry(3, 200).subscribe(function (res) {
            var body = res[0];
            if (body) {
                var bodyHeight = (body.bottom - body.top) || _this.data.bodyHeight || 0;
                if (bodyHeight == 0)
                    throw "zero height";
                _this.setData({ bodyHeight: bodyHeight });
            }
            else {
                throw "not ready";
            }
        });
    }
});
//# sourceMappingURL=footer.js.map