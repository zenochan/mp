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
  toggle()
  {
    this.setData({top: !this.data.top});
  }

});
