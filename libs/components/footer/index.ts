/**
 * 兼容 iPhoneX 底部导航
 */
import { WX } from '../../wx/WX';

// eslint-disable-next-line no-undef
Component({
  attached() {
    WX.isIphoneX().subscribe((res) => this.setData({ iphoneX: res ? 'iphoneX' : '' }));
  },
  data: {
    type: null,
    value: null,
    observer() {
      setTimeout(() => this.calcHeight(), 50);
    },
  },

  options: {
    addGlobalClass: true,
  },
  methods: {
    calcHeight() {
      // @ts-ignore
      WX.size('.fixed', this).retry(3, 200).subscribe((res) => {
        if (res.height === 0) throw new Error('zero height');
        this.setData({ bodyHeight: res.height });
        this.parent && this.parent.resizeBody();
      });
    },
  },

  ready() {
    this.calcHeight();
  },
});
