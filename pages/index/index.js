"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var weapp_1 = require("../../libs/wx/weapp");
weapp_1.HookPage({
    navTitle: 'Zeno‘Lib',
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({ url: '/pages/logs/logs' });
    },
    onLoad: function () {
    },
});
//# sourceMappingURL=index.js.map