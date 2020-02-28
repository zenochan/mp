Component({
  data: {
    h: 0
  },
  options: {
    addGlobalClass: true
  },
  created()
  {
    wx.getSystemInfo({
      success: res => {
        wx.nextTick(() => this.setData({h: res.statusBarHeight}));
      }
    })
  }
});
