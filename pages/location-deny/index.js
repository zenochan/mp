"use strict";
exports.__esModule = true;
var mp_1 = require("../../libs/mp");
mp_1.HookPage({
    navTitle: "拒绝定位授权",
    requestLocation: function () {
        mp_1.WX.getLocation().subscribe(function (res) {
            console.error(res);
        }, function (e) {
            mp_1.UI.alert(e);
        });
    },
    openSetting: function () {
        wx.openSetting();
    }
});
