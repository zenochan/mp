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
  data: {expand: false, marginTop: 0},
  methods: {
    clickHeader()
    {
      if (this.data.anim) return;

      this.setData({expand: !this.data.expand, anim: true});

      WX.queryBoundingClientRect("#body", this).subscribe(res => {
        let body = res[0];
        let bodyHeight = (body.bottom - body.top) || this.data.bodyHeight;
        Interceptor.easeOut(300).subscribe(timer => {
          if (this.data.expand) timer = 1 - timer;
          this.setData({marginTop: -bodyHeight * timer, bodyHeight});
        }, null, () => this.data.anim = false)
      })
    }
  },

  created()
  {
    WX.page().onDataChange().subscribe(() => {
      WX.queryBoundingClientRect("#body", this).subscribe(res => {
        let body = res[0];
        let bodyHeight = body.bottom - body.top;
        if (!this.data.expand) {
          // 收起
          this.setData({marginTop: -bodyHeight, bodyHeight});
        }
      });
    });
  },
  ready()
  {
    WX.queryBoundingClientRect("#body", this).subscribe(res => {
      let body = res[0];
      let bodyHeight = body.bottom - body.top;
      if (!this.data.expand) {
        // 收起
        this.setData({marginTop: -bodyHeight, bodyHeight});
      }
    });
  }
});
