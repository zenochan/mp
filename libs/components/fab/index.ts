// eslint-disable-next-line no-undef
Component({
  data: {
    open: false,
  },
  options: {
    addGlobalClass: true,
  },
  properties: {
    src: { type: String, value: '' },
    right: { type: Number, value: 88 },
    bottom: { type: Number, value: 88 },
  },

  methods: {
    toggle() {
      this.setData({ open: !this.data.open });
      this.triggerEvent('change', { value: this.data.open });
    },

    close() {
      this.setData({ open: false });
      this.triggerEvent('change', { value: this.data.open });
    },
    catTouch() {
      //
    },
  },
});
