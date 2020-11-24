import { Events, UI, WX } from '../../mp';

// eslint-disable-next-line no-undef
Component({
  data: {
    deny: false,
  },
  options: {
    addGlobalClass: true,
  },

  lifetimes: {
    attached() {
      Events.subscribe(WX.EVENT_LOCATION_DENY, () => {
        UI.hideLoading();
        this.setData({ deny: true });
      });
    },
  },

  pageLifetimes: {
    show() {
      WX.getSetting().subscribe((res) => res.userLocation && this.setData({ deny: false }));
    },
  },

  methods: {
    openSetting() {
      // eslint-disable-next-line no-undef
      wx.openSetting();
    },

    hideModal() {
      this.setData({ deny: false });
    },
  },
});
