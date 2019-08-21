"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var weapp_1 = require("../../libs/wx/weapp");
weapp_1.HookPage({
    navTitle: 'Zeno\' Lib',
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false
    },
    onRefresh: function () {
        var _this = this;
        console.log("WTF");
        setTimeout(function () {
            console.log("stop");
            _this.setData({ alreadyLoadData: true });
        }, 500);
    }
});
//# sourceMappingURL=index.js.map