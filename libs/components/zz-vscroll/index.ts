import {WX} from "../../wx/WX";
import {Observable} from "../../rx/Rx";

Component({
  data: {bodyHeight: 0},
  properties: {
    below: {type: String, value: ""},
    above: {type: String, value: ""}
  },

  methods: {
    calcHeight()
    {
      Observable.zip(
          WX.queryBoundingClientRect(this.data.below).map(res => res[0]),
          WX.queryBoundingClientRect("#zz-scroll", this).map(res => res[0]),
          WX.queryBoundingClientRect(this.data.above).map(res => res[0]),
          WX.systemInfo()
      ).subscribe(res => {
        let top = res[1].top;
        let bottom = res[3].windowHeight;

        if (res[0]) top = res[0].bottom;
        if (res[2]) bottom = res[2].top;

        let bodyHeight = bottom - top;
        let pre = this.data.bodyHeight;

        if (bodyHeight != pre) {
          this.setData({bodyHeight});
        }
      });
    }
  },

  ready()
  {
    setInterval(() => this.calcHeight(), 1000);
  }
});
