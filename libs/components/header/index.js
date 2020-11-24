"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WX_1 = require("../../wx/WX");
// eslint-disable-next-line no-undef
Component({
    data: { bodyHeight: 0 },
    properties: {
        noPlaceholder: { type: Boolean, value: false },
        states: { type: null, value: null, observer: 'calcHeight' },
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
        var _this = this;
        this.calcHeight();
        this.sub = WX_1.WX.page().onDataChange.subscribe(function () {
            _this.calcHeight();
            setTimeout(function () { return _this.calcHeight(); }, 200);
        });
    },
    detached: function () {
        this.sub.unsubscribe();
    },
});
//# sourceMappingURL=index.js.map