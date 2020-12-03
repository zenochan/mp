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
    states: { type: null, value: null },
  },

  options: {
    addGlobalClass: true,
  },

  observers: {
    states() {
      this.calcHeight();
    },
  },

  methods: {
    calcHeight() {
      // @ts-ignore
      WX.size('.fixed', this).retry(3, 200).subscribe((res) => {
        this.setData({ bodyHeight: res.height });
      });
    },
  },

  ready() {
    this.calcHeight();
  },
});
