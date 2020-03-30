"use strict";
exports.__esModule = true;
require("libs/utils/extends.date");
var mp_1 = require("./libs/mp");
wx.cloud.init();
exports.db = wx.cloud.database();
//app.js
App({
    onLaunch: function () {
    },
    onShow: function () {
    }
});
mp_1.API.config({
    host: 'http://localhost:8080',
    imgBase: '',
});
