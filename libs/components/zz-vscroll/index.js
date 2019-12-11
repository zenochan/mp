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
        }
    },
    methods: {
        calcHeight: function () {
            var _this = this;
            WX_1.WX.size(".body", this).subscribe(function (size) {
                _this.setData({ bodyHeight: size.height.toFixed(0) });
                console.error(size.height);
            });
        }
    },
    ready: function () {
        // setTimeout(()=>this.calcHeight(),200);
        this.calcHeight();
    }
});
//# sourceMappingURL=index.js.map