import {WX} from "../../wx/WX";

Component({
  properties: {
    flex: {type: Boolean, value: false},
    name: {type: String, value: 'tab'},
    active: {
      type: Number, value: 0, observer: function () {
        this.active(this.data.active)
      }
    }
  },

  options: {
    addGlobalClass: true
  },

  relations: {
    'tab-item': {type: "child"}
  },
  methods: {
    scrollTo(target: any, width: number)
    {
      let scrollLeft = target.offsetLeft - this.data.screenW / 2 + width / 2;
      this.setData({scrollLeft: scrollLeft})
    },

    active(target: any | number)
    {
      let items = this.getRelationNodes('tab-item');
      if (typeof target == 'number') {
        target = items[target];
      }

      if (!target) return;

      let active = 0;
      items.forEach((item, index) => {
        item.active(item == target);
        if (item == target) active = index;
      });
      this.data.active = active;

      let data: any = {};
      data[this.data.name] = active;
      this.page.setData(data);

      this.triggerEvent('change', {active, data: target.dataset});
    }
  },

  attached()
  {
    this.data.screenW = wx.getSystemInfoSync().windowWidth;
    this.page = WX.page();
  },
  ready()
  {
    this.active(this.data.active)
  }
});
