"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WX_1 = require("../../wx/WX");
Component({
    data: { bodyHeight: 0 },
    properties: {},
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
    attached: function () {
        var _this = this;
        this.calcHeight();
        this.sub = WX_1.WX.page().onDataChange.subscribe(function (res) {
            _this.calcHeight();
            setTimeout(function () { return _this.calcHeight(); }, 200);
        });
    },
    detached: function () {
        this.sub.unsubscribe();
    }
});
//# sourceMappingURL=index.js.map