import {WX} from "../../wx/WX";

Component({
  data: {
    granted: false
  },
  methods: {
    onClick()
    {
      this.triggerEvent("tap", this.data.userInfo)
    },
    onGetUserInfo(e: WXEvent)
    {
      if (e.detail.errMsg == "getUserInfo:ok") {
        this.setData({
          granted: true,
          userInfo: e.detail
        });
        this.onClick()
      }
    },
    catchTap(e) {}
  },
  attached()
  {
    WX.getSetting().subscribe(res => {
      this.setData({granted: res.userInfo});
      if (this.data.granted) {
        WX.getUserInfo().subscribe(userInfo => this.setData({userInfo}))
      }
    });
  }
});
