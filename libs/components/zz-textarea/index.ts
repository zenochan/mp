Component({
  properties: {
    placeholder: {type: String, value: ""},
    maxlength: {type: Number, value: -1},
    value: {type: String, value: ""},
    autoHeight: {type: Boolean, value: false},
    disabled: {type: Boolean, value: false}
  },
  options: {
    addGlobalClass: true
  },
  methods: {
    focus()
    {
      if (this.data.disabled) return;
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
