"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WX_1 = require("../../wx/WX");
Component({
    data: {
        statusBar: 44,
        height: '',
        //默认值  默认显示左上角
        navbarData: {
            showCapsule: 1
        }
    },
    properties: {
        navbarData: {
            type: Object,
            value: {},
            observer: function (newVal, oldVal) { }
        }
    },
    attached: function () {
        var _this = this;
        // 获取是否是通过分享进入的小程序
        this.setData({
            share: false
        });
        WX_1.WX.isIphone().subscribe(function (iphone) {
            if (!iphone)
                _this.setData({ statusBar: 40 });
        });
        // 定义导航栏的高度   方便对齐
        wx.getSystemInfo({
            success: function (res) {
                var iphone = res.model.indexOf("iPhone") != -1;
                var statusBar = (iphone ? 44 : 40);
                _this.setData({
                    statusBar: statusBar,
                    height: res.statusBarHeight + statusBar
                });
                // this.globalData.height = res.statusBarHeight
            }
        });
    },
    methods: {
        // 返回上一页面
        _navback: function () {
            wx.navigateBack();
        },
        //返回到首页
        _backhome: function () {
            wx.switchTab({
                url: '/pages/index/index',
            });
        }
    }
});
//# sourceMappingURL=navigation.js.map