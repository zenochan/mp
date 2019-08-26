/**
 * 兼容 iPhoneX 底部导航
 */
import {WX} from "../../wx/WX";

Component({
  attached()
  {
    WX.isIphoneX().subscribe(res => this.setData({iphoneX: res ? 'iphoneX' : ''}))
  },

  options: {
    addGlobalClass: true
  },

  relations: {
    '../zpage/zpage': {
      type: "parent",
      linked(target)
      {
        this.parent = target;
      }
    }
  },

  properties: {
    'cover': {type: Boolean, value: false}
  },

  ready()
  {
    // @ts-ignore
    WX.size(".fixed", this).retry(3, 200).subscribe(res => {
      if (res.height == 0) throw "zero height";
      this.setData({bodyHeight: res.height});
      this.parent && this.parent.resizeBody()
    });
  }
});
