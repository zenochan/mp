"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 兼容 iPhoneX 底部导航
 */
var WX_1 = require("../../wx/WX");
Component({
    externalClasses: ["zclass"],
    attached: function () {
        var _this = this;
        WX_1.WX.isIphoneX().subscribe(function (res) { return _this.setData({ paddingBottom: res ? 68 : 0 }); });
    },
    ready: function () {
        var _this = this;
        WX_1.WX.queryBoundingClientRect(".fixed", this).subscribe(function (res) {
            var body = res[0];
            var bodyHeight = (body.bottom - body.top) || _this.data.bodyHeight;
            console.log(bodyHeight);
            _this.setData({ bodyHeight: bodyHeight });
        });
    }
});
//# sourceMappingURL=footer.js.map