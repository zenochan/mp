"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 兼容 iPhoneX 底部导航
 */
var WX_1 = require("../../wx/WX");
Component({
    attached: function () {
        var _this = this;
        WX_1.WX.isIphoneX().subscribe(function (res) { return _this.setData({ iphoneX: res ? 'iphoneX' : '' }); });
    },
    options: {
        addGlobalClass: true
    },
    relations: {
        '../zpage/zpage': {
            type: "parent",
            linked: function (target) {
                this.parent = target;
            }
        }
    },
    ready: function () {
        var _this = this;
        // @ts-ignore
        WX_1.WX.size(".fixed", this).retry(3, 200).subscribe(function (res) {
            if (res.height == 0)
                throw "zero height";
            _this.setData({ bodyHeight: res.height });
            _this.parent && _this.parent.resizeBody();
        });
    }
});
//# sourceMappingURL=footer.js.map