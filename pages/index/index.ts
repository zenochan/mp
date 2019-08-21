import {HookPage} from "../../libs/wx/weapp";


HookPage({
  navTitle: 'Zeno\' Lib',
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false
  },

  onRefresh()
  {
    console.log("WTF");
    setTimeout(() => {
      console.log("stop");
      this.setData({alreadyLoadData: true});
    }, 500)
  }
});
