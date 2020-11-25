import { WX } from '../../wx/WX';

// eslint-disable-next-line no-undef
Component({
  data: {
    granted: false,
  },
  properties: {
    lang: {
      type: String,
      value: 'zh_CN',
    },
  },
  methods: {
    onClick() {
      this.triggerEvent('tap', this.data.userInfo);
    },

    onGetUserInfo(e: WXEvent) {
      if (e.detail.errMsg === 'getUserInfo:ok') {
        this.data.userInfo = e.detail;
        this.setData({ granted: true });
        this.onClick();
      }
    },
    catchTap() {
      // nothing
    },
  },
  attached() {
    WX.getSetting().subscribe((res) => {
      this.setData({ granted: res.userInfo });
      if (this.data.granted) {
        WX.getUserInfo().subscribe((userInfo) => {
          this.data.userInfo = userInfo;
        });
      }
    });
  },
});
