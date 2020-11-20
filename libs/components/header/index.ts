import {WX} from '../../wx/WX';

Component({
  data: {bodyHeight: 0},
  properties: {
    noPlaceholder: {type: Object, value: false}
  },
  options: {
    addGlobalClass: true
  },

  methods: {
    calcHeight() {
      WX.size('.fixed', this).subscribe(size => {
        this.setData({bodyHeight: size.height});
        this.parent && this.parent.resizeBody();
      });
    }
  },
  attached() {
    this.calcHeight();
    this.sub = WX.page().onDataChange.subscribe(res => {
      this.calcHeight();
      setTimeout(() => this.calcHeight(), 200);
    });
  },

  detached() {
    this.sub.unsubscribe();
  }
});
