//logs.js
// const util = require('../../utils/util.js')
Page({
    data: {
        logs: []
    },
    onLoad: function () {
        this.setData({
            logs: (wx.getStorageSync('logs') || []).map(function (log) {
                // return util.formatTime(new Date(log))
            })
        });
    }
});
//# sourceMappingURL=logs.js.map