import { WX } from '../../wx/WX';

// eslint-disable-next-line no-undef
Component({
  data: { bodyHeight: 0 },
  properties: {
    noPlaceholder: { type: Boolean, value: false },
    states: { type: null, value: null },
  },
  options: {
    addGlobalClass: true,
  },
  observers: {
    states() {
      this.calcHeight();
    },
  },

  methods: {
    calcHeight() {
      WX.size('.fixed', this).subscribe((size) => {
        this.setData({ bodyHeight: size.height });
      }, (error) => {
        console.warn(error);
      });
    },
  },
  attached() {
    this.calcHeight();
  },
});
