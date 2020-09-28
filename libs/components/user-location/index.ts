import {Events, UI, WX} from "../../mp";

Component({
  observers: [],
  data: {
    deny: false
  },
  options: {
    addGlobalClass: true
  },

  lifetimes: {
    attached() {
      Events.subscribe(WX.EVENT_LOCATION_DENY, () => {
          UI.hideLoading();
          this.setData({deny: true});
        }
      )
    },
    detached() {

    }
  },

  pageLifetimes: {
    show() {
      WX.getSetting().subscribe(res => res.userLocation && this.setData({deny: false}));
    }
  },

  methods: {
    openSetting() {
      wx.openSetting();
    },

    hideModal() {
      this.setData({deny: false});
    }
  }
});
