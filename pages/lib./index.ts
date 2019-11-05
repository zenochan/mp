import {HookPage} from "../../libs/wx/weapp";
import {API, UI, WX} from "../../libs/mp";

HookPage({
  navTitle: "控件实验室",
  onLoad()
  {
    WX.login().flatMap(code => API.get(`/user/login/${code}`)).subscribe(res=>{
      UI.alert(res)
    })

  },
  outerTap(e)
  {
    console.error('zz lib', e);
    setTimeout(() => e.detail(), 5000);
  }
});
