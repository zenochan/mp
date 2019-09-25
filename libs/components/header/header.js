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
    methods: {
        calcHeight: function () {
            var _this = this;
            WX_1.WX.size(".fixed", this).subscribe(function (size) {
                _this.setData({ bodyHeight: size.height });
                _this.parent && _this.parent.resizeBody();
            });
        }
    },
    ready: function () {
        this.calcHeight();
    }
});
//# sourceMappingURL=header.js.map