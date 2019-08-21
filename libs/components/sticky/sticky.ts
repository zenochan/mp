import {WX} from "../../wx/WX";

Component({
  data: {top: 0, sticky: false},
  methods: {
    init()
    {
      WX.queryBoundingClientRect(".body", this).subscribe(res => {
        this.setData({
          top: res[0].top,
          height: res[0].bottom - res[0].top
        });
      });
    }
  },
  attached()
  {
    WX.onPageScroll(top => {
      !this.data.sticky && this.data.top < top && this.setData({sticky: true});
      this.data.sticky && this.data.top > top && this.setData({sticky: false})
    })
  },

  ready()
  {
    this.init()
  },
});
