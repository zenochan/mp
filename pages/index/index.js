"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var weapp_1 = require("../../libs/wx/weapp");
var moment = require("../../libs/sdk/momentjs/moment");
weapp_1.HookPage({
    navTitle: 'Zeno\' Lib',
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
        var a = moment();
        for (var i = 0; i < 7; i++) {
            console.log(a.day(i).format('YYYY.MM.DD'));
        }
        var db = wx.cloud.database();
        db.collection('user').get().then(function (res) {
            console.log(res.data);
        });
    },
});
//# sourceMappingURL=index.js.map