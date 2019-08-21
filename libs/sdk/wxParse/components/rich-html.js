"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var wxParse_1 = require("../wxParse");
/**
 * <rich-html src="{{html data}}"></rich-html>
 */
Component({
    properties: {
        src: {
            type: String,
            value: "",
            observer: function (newVal, oldVal) {
                if (newVal == oldVal)
                    return;
                wxParse_1.WxParse.wxParse("__html", newVal, this);
            }
        }
    }
});
//# sourceMappingURL=rich-html.js.map