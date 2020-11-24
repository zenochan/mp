import { WX } from '../../wx/WX';

// eslint-disable-next-line no-undef
Component({
  properties: {
    flex: { type: Boolean, value: false },
    name: { type: String, value: 'tab' },
    active: {
      type: Number,
      value: 0,
      observer() {
        this.active(this.data.active);
      },
    },
  },

  options: {
    addGlobalClass: true,
  },

  relations: {
    'tab-item': { type: 'child' },
  },
  methods: {
    scrollTo(target: any, width: number) {
      const scrollLeft = target.offsetLeft - this.data.screenW / 2 + width / 2;
      this.setData({ scrollLeft });
    },

    active(_target: any | number) {
      let target = _target;
      const items = this.getRelationNodes('tab-item');
      if (typeof target === 'number') {
        target = items[target];
      }

      if (!target) return;

      let active = 0;
      items.forEach((item, index) => {
        item.active(item === target);
        if (item === target) active = index;
      });
      this.data.active = active;

      const data: any = {};
      data[this.data.name] = active;
      this.page.setData(data);

      this.triggerEvent('change', { active, data: target.dataset });
    },
  },

  attached() {
    // eslint-disable-next-line no-undef
    this.data.screenW = wx.getSystemInfoSync().windowWidth;
    this.page = WX.page();
  },
  ready() {
    this.active(this.data.active);
  },
});
