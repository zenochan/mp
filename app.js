"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("libs/utils/extends.date");
var mp_1 = require("./libs/mp");
// import "libs/sdk/momentjs/moment.js";
wx.cloud.init();
exports.db = wx.cloud.database();
//app.js
App({
    onLaunch: function () {
    }
});
mp_1.API.config({
    host: 'http://localhost:8080',
    imgBase: '',
});
//# sourceMappingURL=app.js.map