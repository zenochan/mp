import { WX } from '../../wx/WX';

// eslint-disable-next-line no-undef
Component({
  options: {
    addGlobalClass: true,
  },

  relations: {
    './tabs': {
      type: 'parent',
      linked(target) {
        this.parent = target;
      },
    },
  },

  methods: {
    onClick(e: WXEvent) {
      this.parent.scrollTo(e.currentTarget, this.data.width);
      this.parent.active(this);
    },
    active(active: boolean) {
      if (this.data.active !== active) this.setData({ active });
    },
  },
  ready() {
    WX.size('#body', this).subscribe((size) => this.setData({ width: size.width }));
  },
});
