"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var weapp_1 = require("../../libs/wx/weapp");
weapp_1.HookPage({
    navTitle: "控件实验室",
    outerTap: function (e) {
        console.error('zz lib', e);
        setTimeout(function () { return e.detail(); }, 5000);
    }
});
//# sourceMappingURL=index.js.map