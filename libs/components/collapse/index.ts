/**
 * <collapse>
 *   <view slot="header">header</view>
 *   <view slot="body" class="body" style="height: 20vh;background: orange">body</view>
 * </collapse>
 */
import {WX} from "../../wx/WX";
import {Interceptor} from "../../utils/interceptor";

Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true
  },
  properties: {
    expand: {type: "boolean", value: false}
  },
  data: {
    expand: false,
    marginTop: 0,
  },
  methods: {
    clickHeader()
    {
      if (this.data.anim) return;
      this.calcHeight(() => {
        this.setData({expand: !this.data.expand, anim: true});
        let bodyHeight = this.data.bodyHeight;
        Interceptor.easeOut(300).subscribe(timer => {
          if (this.data.expand) timer = 1 - timer;
          this.setData({marginTop: -bodyHeight * timer, bodyHeight});
        }, null, () => this.setData({anim: false}))
      });
    },

    calcHeight(next?: () => void)
    {
      this.setData({ready: this.data.expand});
      WX.queryBoundingClientRect(".body", this).subscribe(res => {
        let body = res[0];
        let bodyHeight = body.bottom - body.top;

        this.setData({
          marginTop: this.data.expand ? 0 : -bodyHeight,
          bodyHeight,
          ready: true
        });

        next && next();
      });
    }
  },

  attached()
  {
    this.sub = WX.page().onDataChange
        .delay(200)
        .subscribe(res => this.calcHeight());
  },

  ready()
  {
    this.calcHeight();
  },

  detached()
  {
    this.sub.unsubscribe()
  },

});
