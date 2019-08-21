Component({
  data: {
    height: 0
  },

  relations: {
    '../header/header': {
      type: "child",
      linked(target)
      {
        this.header = target;
      }
    },
    '../body/body': {
      type: "child",
      linked(target)
      {
        this.body = target;
      }
    },
    '../footer/footer': {
      type: "child",
      linked(target)
      {
        this.footer = target;
      }
    }
  },

  methods: {
    resizeBody()
    {
      let h = this.data.height;
      if (this.header) {
        h -= this.header.data.bodyHeight
      }
      if (this.footer) {
        h -= this.footer.data.bodyHeight
      }
      this.body.setData({height: h + 'px'});
    }
  },
  ready()
  {
    wx.getSystemInfo({
      success: info => {
        console.log(info.windowHeight);
        this.data.height = info.windowHeight;
      }
    })
  }
});
