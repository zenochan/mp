import {HookPage} from "../../libs/wx/weapp";

HookPage({
  onShareAppMessage()
  {
    return {
      title: "什么鬼啊",
      success(res)
      {
        console.error("WTF", res)
      }
    }
  },
 change(){
    this.zzSetData({datas:[12,1,1,1,1,1]});

  }

});
