"use strict";
exports.__esModule = true;
exports.DbService = void 0;
var app_1 = require("../app");
var DbService = /** @class */ (function () {
    function DbService() {
    }
    DbService.injectUsers = function (page) {
        app_1.db.collection('user').get().then(function (res) { return page.setData({ userList: res.data }); });
    };
    return DbService;
}());
exports.DbService = DbService;
