import {WX} from "../../wx/WX";

Component({
  properties: {
    data: {
      type: null, value: null, observer: function () {
        setTimeout(() => this.calcHeight(), 50);
      }
    }
  },

  methods: {
    calcHeight()
    {
      WX.size(".fixed", this).subscribe(size => this.setData({bodyHeight: size.height}));
    }
  },
  ready()
  {
    this.calcHeight();
  }
});
