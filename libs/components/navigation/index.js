"use strict";
exports.__esModule = true;
var WX_1 = require("../../wx/WX");
var mp_1 = require("../../mp");
Component({
    data: {
        height: '',
    },
    properties: {
        title: { type: String, value: null },
        hideNav: { type: Boolean, value: false }
    },
    options: {
        addGlobalClass: true
    },
    attached: function () {
        var _this = this;
        WX_1.WX.systemInfo().subscribe(function (res) {
            var m = wx.getMenuButtonBoundingClientRect();
            var paddingR = m.width + (res.windowWidth - m.right) * 2;
            _this.setData({ paddingR: paddingR });
        });
        WX_1.WX.navHeight().subscribe(function (height) { return _this.setData({ height: height }); });
    },
    methods: {
        back: function () {
            mp_1.Nav.navBackOrIndex();
        }
    }
});
