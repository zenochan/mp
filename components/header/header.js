"use strict";
exports.__esModule = true;
var WX_1 = require("../../libs/wx/WX");
Component({
    externalClasses: ["zclass"],
    ready: function () {
        var _this = this;
        WX_1.WX.queryBoundingClientRect(".fixed", this).subscribe(function (res) {
            var body = res[0];
            var bodyHeight = (body.bottom - body.top) || _this.data.bodyHeight;
            console.log(bodyHeight);
            _this.setData({ bodyHeight: bodyHeight });
        });
    }
});
//# sourceMappingURL=header.js.map