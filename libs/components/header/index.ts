import {WX} from "../../wx/WX";

Component({
  data: {bodyHeight: 0},
  properties: {},
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
  attached()
  {
    this.calcHeight();
    this.sub = WX.page().onDataChange.subscribe(res => {
      this.calcHeight();
      setTimeout(() => this.calcHeight(), 200);
    });
  },

  detached()
  {
    this.sub.unsubscribe()
  }
});
