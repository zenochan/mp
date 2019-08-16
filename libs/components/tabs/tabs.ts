Component({
  properties: {flex: {type: Boolean, value: false}},
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
      this.getRelationNodes('tab-item').forEach(item => item.active(item == target));
    }
  },

  attached()
  {
    this.data.screenW = wx.getSystemInfoSync().windowWidth;
  },
  ready()
  {
    let first = this.getRelationNodes('tab-item')[0];
    first && first.active(true)
  }
});
