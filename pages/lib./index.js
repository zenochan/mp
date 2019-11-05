"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var weapp_1 = require("../../libs/wx/weapp");
var mp_1 = require("../../libs/mp");
weapp_1.HookPage({
    navTitle: "控件实验室",
    onLoad: function () {
        mp_1.WX.login().flatMap(function (code) { return mp_1.API.get("/user/login/" + code); }).subscribe(function (res) {
            mp_1.UI.alert(res);
        });
    },
    outerTap: function (e) {
        console.error('zz lib', e);
        setTimeout(function () { return e.detail(); }, 5000);
    }
});
//# sourceMappingURL=index.js.map