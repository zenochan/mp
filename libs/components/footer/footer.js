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
        WX_1.WX.size(".fixed", this).retry(3, 200).subscribe(function (res) {
            if (res.height == 0)
                throw "zero height";
            _this.setData({ bodyHeight: res.height });
        });
    }
});
//# sourceMappingURL=footer.js.map