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
    data: {
        type: null, value: null, observer: function () {
            var _this = this;
            setTimeout(function () { return _this.calcHeight(); }, 50);
        }
    },
    options: {
        addGlobalClass: true
    },
    methods: {
        calcHeight: function () {
            var _this = this;
            // @ts-ignore
            WX_1.WX.size(".fixed", this).retry(3, 200).subscribe(function (res) {
                if (res.height == 0)
                    throw "zero height";
                _this.setData({ bodyHeight: res.height });
                _this.parent && _this.parent.resizeBody();
            });
        }
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
        this.calcHeight();
    }
});
//# sourceMappingURL=footer.js.map