import {WX} from "../../wx/WX";

Component({
  data: {bodyHeight: 0},
  properties: {
    data: {
      type: null, value: null, observer: function () {
        setTimeout(() => this.calcHeight(), 50);
      }
    }
  },
  options: {
    addGlobalClass: true
  },
  relations: {
    '../zpage/zpage': {
      type: "parent",
      linked(target)
      {
        this.parent = target;
      }
    }
  },

  methods: {
    calcHeight()
    {
      WX.size(".fixed", this).subscribe(size => {
        this.setData({bodyHeight: size.height});
        this.parent && this.parent.resizeBody()
      });
    }
  },
  ready()
  {
    this.calcHeight();
  }
});
