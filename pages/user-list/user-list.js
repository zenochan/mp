"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var weapp_1 = require("../../libs/wx/weapp");
var app_1 = require("../../app");
weapp_1.HookPage({
    navTitle: '用户列表',
    onLoad: function () {
        this.getUsers();
    },
    addUser: function () {
        var _this = this;
        app_1.db.collection('user').add({ data: this.data.form }).then(function (res) { return _this.getUsers(); });
    },
    getUsers: function () {
        var _this = this;
        app_1.db.collection("user").get().then(function (res) { return _this.setData({ userList: res.data }); });
    }
});
//# sourceMappingURL=user-list.js.map