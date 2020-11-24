import { WX } from '../../wx/WX';

// eslint-disable-next-line no-undef
Component({
  data: {
    top: 0,
    offset: 0,
    sticky: false,
  },

  options: {
    addGlobalClass: true,
  },

  properties: {
    offset: { type: Number, value: 0 },
  },
  methods: {
    init() {
      WX.queryBoundingClientRect('.element', this).subscribe((res) => {
        if (res.length >= 2) {
          this.setData({
            top: this.pageTop + res[0].top,
            height: res[1].height,
          });
        }
      });
    },
  },
  attached() {
    this.pageTop = 0;
    WX.onPageScroll((_top) => {
      let top = _top;
      this.pageTop = top;
      top += this.data.offset;

      if (!this.data.sticky && this.data.top < top) {
        this.setData({ sticky: true });
      } else if (this.data.sticky && this.data.top > top) {
        this.setData({ sticky: false });
      }
    });

    this.sub = WX.page().onDataChange.subscribe(() => {
      this.init();
      setTimeout(() => this.init(), 200);
    });
  },

  detached() {
    this.sub.unsubscribe();
  },

  ready() {
    this.init();
  },
});
