Component({
    data: {
        h: 0
    },
    options: {
        addGlobalClass: true
    },
    created: function () {
        var _this = this;
        wx.getSystemInfo({
            success: function (res) {
                wx.nextTick(function () { return _this.setData({ h: res.statusBarHeight }); });
            }
        });
    }
});
