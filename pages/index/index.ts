import {HookPage} from "../../libs/wx/weapp";
import * as moment from "../../libs/sdk/momentjs/moment";



HookPage({
  navTitle: 'Zeno\' Lib',
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
    let a  = moment();
    for (let i = 0; i < 7; i++) {
      console.log(a.day(i).format('YYYY.MM.DD'));
    }

    let db = wx.cloud.database();
    db.collection('user').get().then(res=>{
      console.log(res.data)
    });
  },
});
