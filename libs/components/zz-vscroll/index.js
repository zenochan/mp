"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WX_1 = require("../../wx/WX");
Component({
    data: { bodyHeight: 0 },
    properties: {
        data: {
            type: null, value: null, observer: function () {
                var _this = this;
                setTimeout(function () { return _this.calcHeight(); }, 50);
            }
        },
        delay: { type: Number, value: 100 }
    },
    methods: {
        calcHeight: function () {
            var _this = this;
            WX_1.WX.size(".body", this).subscribe(function (size) {
                if (size.height == 0) {
                    console.log("retry");
                    setTimeout(function () { return _this.calcHeight(); }, _this.data.delay);
                }
                else {
                    _this.setData({ bodyHeight: size.height.toFixed(0) });
                }
            });
        }
    },
    ready: function () {
        this.calcHeight();
    }
});
//# sourceMappingURL=index.js.map