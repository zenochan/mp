/**
 * 兼容 iPhoneX 底部导航
 */
import {WX} from "../../wx/WX";

Component({
  attached()
  {
    WX.isIphoneX().subscribe(res => this.setData({paddingBottom: res ? 68 : 0}))
  },

  properties: {
    inTabs: {type: Boolean, value: false},
    bgColor: {type: String, value: "#F7F7F7"}
  },

  ready()
  {
    // @ts-ignore
    WX.queryBoundingClientRect(".fixed", this).retry(3, 200).subscribe(res => {
      let body = res[0];
      if (body) {
        let bodyHeight = (body.bottom - body.top) || this.data.bodyHeight || 0;
        if (bodyHeight == 0) throw "zero height";
        this.setData({bodyHeight});
      } else {
        throw "not ready"
      }
    });
  }
});
