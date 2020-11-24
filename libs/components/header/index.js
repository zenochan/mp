"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WX_1 = require("../../wx/WX");
// eslint-disable-next-line no-undef
Component({
    data: {
        bodyHeight: 0,
    },
    properties: {
        noPlaceholder: { type: Boolean, value: false },
    },
    options: {
        addGlobalClass: true,
    },
    methods: {
        calcHeight: function () {
            var _this = this;
            WX_1.WX.size('.fixed', this).subscribe(function (size) {
                _this.setData({ bodyHeight: size.height });
            });
        },
    },
    attached: function () {
        this.calcHeight();
    },
    pageLifetimes: {
        resize: function () {
            this.calcHeight();
        },
    },
});
//# sourceMappingURL=index.js.map