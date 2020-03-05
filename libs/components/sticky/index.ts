import {WX} from "../../wx/WX";

Component({
  data: {
    top: 0,
    offset: 0,
    sticky: false
  },

  options: {
    addGlobalClass: true
  },

  properties: {
    data: {
      type: Array, value: null, observer()
      {
        this.init();
      }
    },
    offset: {type: Number, value: 0}
  },
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
      top += this.data.offset;
      !this.data.sticky && this.data.top < top && this.setData({sticky: true});
      this.data.sticky && this.data.top > top && this.setData({sticky: false})
    })
  },

  ready()
  {
    this.init()
  },
});
