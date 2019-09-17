import {HookPage} from "../../libs/wx/weapp";

HookPage({
  navTitle:"控件实验室",
  outerTap(e){
    console.error('zz lib',e);
    setTimeout(()=>e.detail(),5000);
  }
});
