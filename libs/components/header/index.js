"use strict";
exports.__esModule = true;
var WX_1 = require("../../wx/WX");
// eslint-disable-next-line no-undef
Component({
    data: { bodyHeight: 0 },
    properties: {
        noPlaceholder: { type: Boolean, value: false },
        states: { type: null, value: null }
    },
    options: {
        addGlobalClass: true
    },
    observers: {
        states: function () {
            this.calcHeight();
        }
    },
    methods: {
        calcHeight: function () {
            var _this = this;
            WX_1.WX.size('.fixed', this).subscribe(function (size) {
                _this.setData({ bodyHeight: size.height });
            });
        }
    },
    attached: function () {
        var _this = this;
        this.calcHeight();
        setTimeout(function () { return _this.calcHeight(); }, 100);
    }
});
