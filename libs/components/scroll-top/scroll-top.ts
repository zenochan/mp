import {WX} from "../../WX";

Component({
  data: {
    showTop: false        // 是否显示
  },
  methods: {
    scrollTop()
    {
      wx.pageScrollTo({scrollTop: 0})
    }
  },
  properties: {
    top: {type: Number, value: 1000}
  },
  attached()
  {
    WX.onPageScroll(top => {
      let hold = this.data.top;
      if (top > hold && !this.data.showTop) {
        this.setData({showTop: true})
      } else if (top < hold && this.data.showTop) {
        this.setData({showTop: false})
      }
    })

  }

});
