import {WX} from "../../wx/WX";
import {Nav} from "../../mp";

Component({
  data: {
    height: '',
  },
  properties: {
    title: {type: String, value: null},
    hideNav: {type: Boolean, value: false}
  },

  attached: function () {
    WX.systemInfo().subscribe(res => {
      let m = wx.getMenuButtonBoundingClientRect();
      let paddingR = m.width + (res.windowWidth - m.right) * 2;
      this.setData({paddingR});
    });

    WX.navHeight().subscribe(height => this.setData({height: height}));
  },

  methods: {
    back()
    {
      Nav.navBackOrIndex()
    }
  }
});
