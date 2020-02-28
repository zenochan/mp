Component({
  data: {
    h: 0
  },
  options: {
    addGlobalClass: true
  },
  attached()
  {
    wx.getSystemInfo({
      success: res => {
        this.setData({h: res.statusBarHeight});
      }
    })

  }
});
