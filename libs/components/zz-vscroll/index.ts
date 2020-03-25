import {WX} from "../../wx/WX";
import {Observable} from "../../rx/Rx";
import {rxJust} from "../../mp";

Component({
  data: {bodyHeight: 0},
  properties: {
    below: {type: String, value: ""},
    above: {type: String, value: ""}
  },

  methods: {
    calcHeight()
    {
      wx.pageScrollTo({scrollTop: 0});

      let below = this.data.below ? WX.queryBoundingClientRect(this.data.below).map(res => res[0]) : rxJust(null);
      let above = this.data.above ? WX.queryBoundingClientRect(this.data.above).map(res => res[0]) : rxJust(null);
      Observable.zip(
          below,
          WX.queryBoundingClientRect("#zz-scroll", this).map(res => res[0]),
          above,
      ).subscribe(res => {
        let top = res[1].top;
        let bottom = this.data.windowHeight;

        if (res[0]) top = res[0].bottom;
        if (res[2]) bottom = res[2].top;

        let bodyHeight = bottom - top;
        if (bodyHeight != this.data.bodyHeight) {
          this.setData({bodyHeight});
        }
      });
    }
  },

  attached()
  {
    WX.systemInfo().subscribe(res => {
      this.data.windowHeight = res.windowHeight;
      this.calcHeight();

      this.sub = WX.page().onDataChange.subscribe(res => {
        this.calcHeight();
        setTimeout(() => this.calcHeight(), 200);
      });
    });
  },

  detached()
  {
    this.sub.unsubscribe()
  }
});
