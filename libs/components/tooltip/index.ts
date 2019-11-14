Component({
  data: {
    show: false,
    position: ''
  },
  properties: {
    position: {type: String, value: ''},
    shadowColor: {type: String, value: 'rgba(0, 0, 0, 0)'},
    autoHide: {type: Boolean, value: true}
  },
  options: {
    multipleSlots: true,
    addGlobalClass: true
  },
  methods: {
    show()
    {
      this.setData({show: true});
    },
    hide()
    {
      this.setData({show: false});
    },
    onClickTip(){
      if(this.data.autoHide) this.hide();
    }
  }
});
