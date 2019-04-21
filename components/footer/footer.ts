/**
 * 兼容 iPhoneX 底部导航
 */
import {WX} from "../../libs/wx/WX";

Component({
  externalClasses: ["zclass"],

  attached()
  {
    WX.isIphoneX().subscribe(res => this.setData({paddingBottom: res ? 68 : 0}))
  },

  ready()
  {
    WX.queryBoundingClientRect(".fixed", this).subscribe(res => {
      let body = res[0];
      let bodyHeight = (body.bottom - body.top) || this.data.bodyHeight;
      console.log(bodyHeight);
      this.setData({bodyHeight});
    });
  }
});
