Component({
  methods: {
    onClick()
    {
      this.triggerEvent("tap", this.data.mobile)
    },
    onGetPhoneNumber(e: WXEvent)
    {
      if (e.detail.errMsg == "getPhoneNumber:ok") {
        this.setData({mobile: e.detail});
        this.onClick()
      }
    },
    catchTap(e) {}
  }
});
