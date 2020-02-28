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
                _this.setData({ h: res.statusBarHeight });
            }
        });
    }
});
//# sourceMappingURL=index.js.map