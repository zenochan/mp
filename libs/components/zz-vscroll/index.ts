import {WX} from "../../wx/WX";

Component({
  data: {bodyHeight: 0},
  properties: {
    data: {
      type: null, value: null, observer: function () {
        setTimeout(() => this.calcHeight(), 50);
      }
    },
    delay: {
      type: Number, value: 0
    }
  },

  methods: {
    calcHeight()
    {
      WX.size(".body", this).subscribe(size => {
        this.setData({bodyHeight: size.height.toFixed(0)});
      });
    }
  },
  ready()
  {
    setTimeout(() => this.calcHeight(), this.data.delay);
  }
});
