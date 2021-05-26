"use strict";
exports.__esModule = true;
var WX_1 = require("../../wx/WX");
// 小程序登录、用户信息相关接口调整说明
// https://developers.weixin.qq.com/community/develop/doc/000cacfa20ce88df04cb468bc52801?highLine=login
//
// eslint-disable-next-line no-undef
Component({
    data: {
        granted: false,
        profile: false
    },
    properties: {
        lang: {
            type: String,
            value: 'zh_CN'
        },
        desc: {
            type: String,
            value: '小程序需要获取您的头像和昵称'
        }
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
        getUserProfile: function () {
            var _this = this;
            if (this.data.userInfo) {
                this.onClick();
            }
            else {
                wx.getUserProfile({
                    lang: 'zh_CN',
                    desc: this.data.desc,
                    success: function (res) {
                        _this.data.userInfo = res.userInfo;
                        _this.onClick();
                    },
                    fail: function (e) {
                        console.error('getUserProfile::fail', e);
                    }
                });
            }
        },
        catchTap: function () {
            // nothing
        }
    },
    attached: function () {
        var _this = this;
        if (!wx.getUserProfile) {
            WX_1.WX.getSetting().subscribe(function (res) {
                _this.setData({ granted: res.userInfo });
                if (_this.data.granted) {
                    WX_1.WX.getUserInfo().subscribe(function (userInfo) {
                        _this.data.userInfo = userInfo;
                    });
                }
            });
        }
        else {
            this.setData({ profile: true });
        }
    }
});
