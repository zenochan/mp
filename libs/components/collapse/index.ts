/**
 * <collapse>
 *   <view slot="header">header</view>
 *   <view slot="body" class="body" style="height: 20vh;background: orange">body</view>
 * </collapse>
 */
import { WX } from '../../wx/WX';
import { Interceptor } from '../../utils/interceptor';

// eslint-disable-next-line no-undef
Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true,
  },
  properties: {
    expand: { type: Boolean, value: false },
  },
  data: {
    expand: false,
    marginTop: 0,
  },
  methods: {
    clickHeader() {
      if (this.data.anim) return;
      this.calcHeight(() => {
        this.setData({ expand: !this.data.expand, anim: true });
        const { bodyHeight } = this.data;
        Interceptor.easeOut(300).subscribe((_timer) => {
          let timer = _timer;
          if (this.data.expand) timer = 1 - timer;
          this.setData({ marginTop: -bodyHeight * timer, bodyHeight });
        }, null, () => this.setData({ anim: false }));
      });
    },

    calcHeight(next?: () => void) {
      this.setData({ ready: this.data.expand });
      WX.queryBoundingClientRect('.body', this).subscribe((res) => {
        const body = res[0];
        const bodyHeight = body.bottom - body.top;

        // eslint-disable-next-line no-undef
        wx.nextTick(() => {
          this.setData({
            marginTop: this.data.expand ? 0 : -bodyHeight,
            bodyHeight,
            ready: true,
          });
        });

        if (typeof next === 'function') next();
      });
    },
  },

  attached() {
    this.sub = WX.page().onDataChange
      .delay(200)
      .subscribe(() => this.calcHeight());
  },

  ready() {
    this.calcHeight();
  },

  detached() {
    this.sub.unsubscribe();
  },

});
