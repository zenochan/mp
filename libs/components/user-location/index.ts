import {Events, WX} from "../../mp";

Component({
  observers: [],
  data: {
    deny: true
  },
  options: {
    addGlobalClass: true
  },

  lifetimes: {
    attached()
    {
      Events.subscribe(WX.EVENT_LOCATION_DENY, () => this.setData({deny: true}))
    },
    detached()
    {

    }
  },

  pageLifetimes: {
    show()
    {
      WX.getSetting().subscribe(res => res.userLocation && this.setData({deny: false}));
    }
  },

  methods: {
    openSetting()
    {
      wx.openSetting();
    },

    hideModal()
    {
      this.setData({deny: false});
    }
  }
});
