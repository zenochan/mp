import {WX} from "../../mp";

Component({
  data:{
    h:0
  },
  attached()
  {
    wx.getSystemInfo({
      success:res=>{
        this.setData({h:res.statusBarHeight});
      }
    })

  }
});
