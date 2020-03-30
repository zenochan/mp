import {HookPage, UI, WX} from "../../libs/mp";

HookPage({
  navTitle: "拒绝定位授权",

  requestLocation()
  {
    WX.getLocation().subscribe(res => {
      console.error(res);
    }, e => {
      UI.alert(e)
    })
  },

  openSetting()
  {
    wx.openSetting();
  },

});
