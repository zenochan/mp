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
    offset: {type: Number, value: 0}
  },
  methods: {
    init()
    {
      WX.queryBoundingClientRect(".element", this).subscribe(res => {
        this.setData({
          top: this.pageTop + res[0].top,
          height: res[1].height
        });
      });
    }
  },
  attached()
  {
    this.pageTop = 0;
    WX.onPageScroll(top => {
      this.pageTop = top;
      top += this.data.offset;
      !this.data.sticky && this.data.top < top && this.setData({sticky: true});
      this.data.sticky && this.data.top > top && this.setData({sticky: false})
    });

    this.sub = WX.page().onDataChange.subscribe(res => {
      this.init();
      setTimeout(() => this.init(), 200)
    });
  },

  detached()
  {
    this.sub.unsubscribe();
  },

  ready()
  {
    this.init()
  },
});
