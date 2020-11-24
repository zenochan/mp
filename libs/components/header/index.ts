import { WX } from '../../wx/WX';

// eslint-disable-next-line no-undef
Component({
  data: { bodyHeight: 0 },
  properties: {
    noPlaceholder: { type: Boolean, value: false },
  },
  options: {
    addGlobalClass: true,
  },

  methods: {
    calcHeight() {
      WX.size('.fixed', this).subscribe((size) => {
        this.setData({ bodyHeight: size.height });
      });
    },
  },
  attached() {
    this.calcHeight();
    this.sub = WX.page().onDataChange.subscribe(() => {
      this.calcHeight();
      setTimeout(() => this.calcHeight(), 200);
    });
  },

  detached() {
    this.sub.unsubscribe();
  },
});
