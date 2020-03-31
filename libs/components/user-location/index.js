"use strict";
exports.__esModule = true;
var mp_1 = require("../../mp");
Component({
    observers: [],
    data: {
        deny: false
    },
    options: {
        addGlobalClass: true
    },
    lifetimes: {
        attached: function () {
            var _this = this;
            mp_1.Events.subscribe(mp_1.WX.EVENT_LOCATION_DENY, function () { return _this.setData({ deny: true }); });
        },
        detached: function () {
        }
    },
    pageLifetimes: {
        show: function () {
            var _this = this;
            mp_1.WX.getSetting().subscribe(function (res) { return res.userLocation && _this.setData({ deny: false }); });
        }
    },
    methods: {
        openSetting: function () {
            wx.openSetting();
        },
        hideModal: function () {
            this.setData({ deny: false });
        }
    }
});
