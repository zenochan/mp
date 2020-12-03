/**
 * 兼容 iPhoneX 底部导航
 */
import { WX } from '../../wx/WX';

// eslint-disable-next-line no-undef
Component({
  attached() {
    WX.isIphoneX().subscribe((res) => this.setData({ iphoneX: res ? 'iphoneX' : '' }));
  },
  properties: {
    states: {
      type: null,
      value: null,
      observer() {
        wx.nextTick(() => this.calcHeight());
      },
    },
  },

  options: {
    addGlobalClass: true,
  },

  methods: {
    calcHeight() {
      // @ts-ignore
      WX.size('.fixed', this).subscribe((res) => {
        this.setData({ bodyHeight: res.height });
      });
    },
  },

  ready() {
    this.calcHeight();
  },
});
