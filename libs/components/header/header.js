"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WX_1 = require("../../wx/WX");
Component({
    properties: {
        data: {
            type: null, value: null, observer: function () {
                var _this = this;
                setTimeout(function () { return _this.calcHeight(); }, 50);
            }
        }
    },
    methods: {
        calcHeight: function () {
            var _this = this;
            WX_1.WX.size(".fixed", this).subscribe(function (size) { return _this.setData({ bodyHeight: size.height }); });
        }
    },
    ready: function () {
        this.calcHeight();
    }
});
//# sourceMappingURL=header.js.map