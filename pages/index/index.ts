import {HookPage} from "../../libs/wx/weapp";

HookPage({
  navTitle:'Zeno‘Lib',
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false
  },
  //事件处理函数
  bindViewTap()
  {
    wx.navigateTo({url: '/pages/logs/logs'})
  },
  onLoad()
  {
  },
});
