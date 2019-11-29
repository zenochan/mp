Component({
  properties: {
    placeholder: {type: String, value: ""},
    value: {type: String, value: ""},
    autoHeight: {type: Boolean, value: false}
  },
  options: {
    addGlobalClass: true
  },
  methods: {
    focus()
    {
      this.setData({focus: true});
    },

    onInput(e)
    {
      let value = e.detail.value;
      this.setData({value});
      this.triggerEvent("input", {value});
    },
    onBlur()
    {
      this.setData({focus: false});
    }
  }
});
