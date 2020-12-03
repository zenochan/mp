"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 兼容 iPhoneX 底部导航
 */
var WX_1 = require("../../wx/WX");
// eslint-disable-next-line no-undef
Component({
    attached: function () {
        var _this = this;
        WX_1.WX.isIphoneX().subscribe(function (res) { return _this.setData({ iphoneX: res ? 'iphoneX' : '' }); });
    },
    properties: {
        states: { type: null, value: null },
    },
    options: {
        addGlobalClass: true,
    },
    observers: {
        states: function () {
            this.calcHeight();
        },
    },
    methods: {
        calcHeight: function () {
            var _this = this;
            // @ts-ignore
            WX_1.WX.size('.fixed', this).retry(3, 200).subscribe(function (res) {
                _this.setData({ bodyHeight: res.height });
            });
        },
    },
    ready: function () {
        this.calcHeight();
    },
});
//# sourceMappingURL=index.js.map