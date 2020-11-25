"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WX_1 = require("../../wx/WX");
// eslint-disable-next-line no-undef
Component({
    data: {
        granted: false,
    },
    properties: {
        lang: {
            type: String,
            value: 'zh_CN',
        },
    },
    methods: {
        onClick: function () {
            this.triggerEvent('tap', this.data.userInfo);
        },
        onGetUserInfo: function (e) {
            if (e.detail.errMsg === 'getUserInfo:ok') {
                this.data.userInfo = e.detail;
                this.setData({ granted: true });
                this.onClick();
            }
        },
        catchTap: function () {
            // nothing
        },
    },
    attached: function () {
        var _this = this;
        WX_1.WX.getSetting().subscribe(function (res) {
            _this.setData({ granted: res.userInfo });
            if (_this.data.granted) {
                WX_1.WX.getUserInfo().subscribe(function (userInfo) {
                    _this.data.userInfo = userInfo;
                });
            }
        });
    },
});
//# sourceMappingURL=index.js.map