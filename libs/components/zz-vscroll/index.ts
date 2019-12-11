import {WX} from "../../wx/WX";

Component({
  data: {bodyHeight: 0},
  properties: {
    data: {
      type: null, value: null, observer: function () {
        setTimeout(() => this.calcHeight(), 50);
      }
    },
    delay: {type: Number, value: 100}
  },

  methods: {
    calcHeight()
    {
      WX.size(".body", this).subscribe(size => {
        if (size.height == 0) {
          console.log("retry");
          setTimeout(() => this.calcHeight(), this.data.delay);
        } else {
          this.setData({bodyHeight: size.height.toFixed(0)});
        }
      });
    }
  },
  ready()
  {
    this.calcHeight();
  }
});
