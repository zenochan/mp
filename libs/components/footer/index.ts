/**
 * 兼容 iPhoneX 底部导航
 */
import {WX} from "../../wx/WX";

Component({
  attached()
  {
    WX.isIphoneX().subscribe(res => this.setData({iphoneX: res ? 'iphoneX' : ''}))
  },
  data: {
    type: null, value: null, observer: function () {
      setTimeout(() => this.calcHeight(), 50);
    }
  },

  options: {
    addGlobalClass: true
  },
  methods:{
    calcHeight(){
      // @ts-ignore
      WX.size(".fixed", this).retry(3, 200).subscribe(res => {
        if (res.height == 0) throw "zero height";
        this.setData({bodyHeight: res.height});
        this.parent && this.parent.resizeBody()
      });
    }
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

  ready()
  {
    this.calcHeight();
  }
});
