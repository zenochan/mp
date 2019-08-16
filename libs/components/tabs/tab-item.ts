import {WX} from "../../wx/WX";

Component({
  externalClasses: ["class-active"],

  properties: {
    active: {
      type: Boolean, value: false, observer: function (newVal, oldVal) {
        if (newVal != oldVal && newVal) {
          wx.nextTick(() => this.parent.active(this));
        }
      }
    }
  },

  relations: {
    './tabs': {
      type: 'parent',
      linked(target)
      {
        this.parent = target;
      }
    }
  },

  methods: {
    onClick(e: WXEvent)
    {
      this.parent.scrollTo(e.currentTarget, this.data.width);
      this.parent.active(this);
    },
    active(active: boolean)
    {
      this.setData({active: active ? 'active' : ''});
    }
  },
  ready()
  {
    WX.size("#body", this).subscribe(size => this.setData({width: size.width}))
  }
});
