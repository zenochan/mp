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
        delay: {
            type: Number, value: 0
        }
    },
    methods: {
        calcHeight: function () {
            var _this = this;
            WX_1.WX.size(".body", this).subscribe(function (size) {
                _this.setData({ bodyHeight: size.height.toFixed(0) });
            });
        }
    },
    ready: function () {
        var _this = this;
        setTimeout(function () { return _this.calcHeight(); }, this.data.delay);
    }
});
//# sourceMappingURL=index.js.map