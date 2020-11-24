"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WX_1 = require("../../wx/WX");
// eslint-disable-next-line no-undef
Component({
    data: { bodyHeight: 0 },
    properties: {
        noPlaceholder: { type: Boolean, value: false },
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
            WX_1.WX.size('.fixed', this).subscribe(function (size) {
                _this.setData({ bodyHeight: size.height });
            }, function (error) {
                console.warn(error);
            });
        },
    },
    attached: function () {
        this.calcHeight();
    },
});
//# sourceMappingURL=index.js.map