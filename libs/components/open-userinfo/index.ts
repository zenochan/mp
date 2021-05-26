import { WX } from '../../wx/WX';

// 小程序登录、用户信息相关接口调整说明
// https://developers.weixin.qq.com/community/develop/doc/000cacfa20ce88df04cb468bc52801?highLine=login
//
// eslint-disable-next-line no-undef
Component({
  data: {
    granted: false,
    profile: false,
  },
  properties: {
    lang: {
      type: String,
      value: 'zh_CN',
    },
    desc: {
      type: String,
      value: '小程序需要获取您的头像和昵称',
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

    getUserProfile() {
      if (this.data.userInfo) {
        this.onClick();
      } else {
        wx.getUserProfile({
          lang: 'zh_CN',
          desc: this.data.desc,
          success: (res) => {
            this.data.userInfo = res.userInfo;
            this.onClick();
          },
          fail(e) {
            console.error('getUserProfile::fail', e);
          },
        });
      }
    },

    catchTap() {
      // nothing
    },
  },
  attached() {
    if (!wx.getUserProfile) {
      WX.getSetting().subscribe((res) => {
        this.setData({ granted: res.userInfo });
        if (this.data.granted) {
          WX.getUserInfo().subscribe((userInfo) => {
            this.data.userInfo = userInfo;
          });
        }
      });
    } else {
      this.setData({ profile: true });
    }
  },
});
