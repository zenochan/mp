"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WX_1 = require("../../wx/WX");
// eslint-disable-next-line no-undef
Component({
    options: {
        addGlobalClass: true,
    },
    relations: {
        './tabs': {
            type: 'parent',
            linked: function (target) {
                this.parent = target;
            },
        },
    },
    methods: {
        onClick: function (e) {
            this.parent.scrollTo(e.currentTarget, this.data.width);
            this.parent.active(this);
        },
        active: function (active) {
            if (this.data.active !== active)
                this.setData({ active: active });
        },
    },
    ready: function () {
        var _this = this;
        WX_1.WX.size('#body', this).subscribe(function (size) { return _this.setData({ width: size.width }); });
    },
});
//# sourceMappingURL=tab-item.js.map