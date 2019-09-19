Component({
  properties: {
    flex: {type: Boolean, value: false},
    name: {type: String, value: 'tab'},
    active: {type: Number, value: 0}
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

    active(target)
    {
      let items = this.getRelationNodes('tab-item');
      let active = 0;
      items.forEach((item, index) => {
        item.active(item == target);
        if (item == target) active = index;
      });
      this.data.active = active;
      this.triggerEvent('change', {active, data: target.dataset});
      let data: any = {};
      data[this.data.name] = active;
      this.page.setData(data);
    }
  },

  attached()
  {
    this.data.screenW = wx.getSystemInfoSync().windowWidth;

    let pages = getCurrentPages();
    this.page = pages[pages.length - 1];
  },
  ready()
  {
    let active = this.getRelationNodes('tab-item')[this.data.active];
    active && active.active(true);
  }
});
