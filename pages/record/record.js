"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var weapp_1 = require("../../libs/wx/weapp");
var db_service_1 = require("../../service/db.service");
weapp_1.HookPage({
    navTitle: '加分',
    data: {
        date: new Date().format('yyyy.MM.dd'),
        score: [
            { name: '减脂打卡', score: 20, count: 0 },
            { name: '语音打卡', score: 30, count: 0 },
            { name: '原创素材', score: 30, count: 0 },
            { name: '出货(盒)', score: 10, count: 0 },
            { name: '授权(元)', score: 0.01, count: 0 },
        ]
    },
    onShow: function () {
        db_service_1.DbService.injectUsers(this);
    },
    activeUser: function (e) {
        var userActive = e.currentTarget.dataset.user.wechat;
        this.setData({ userActive: userActive });
    },
    input: function (e) {
        var value = e.detail.value;
        var index = e.currentTarget.dataset.index;
        this.data.score[index].count = value;
        this.setData({ score: this.data.score });
    },
    plus: function (e) {
        var index = e.currentTarget.dataset.index;
        this.data.score[index].count++;
        this.setData({ score: this.data.score });
    },
    minus: function (e) {
        var index = e.currentTarget.dataset.index;
        this.data.score[index].count--;
        this.setData({ score: this.data.score });
    }
});
//# sourceMappingURL=record.js.map