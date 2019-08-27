import {WX} from "../../wx/WX";

Component({

  data: {
    x: 0,           // x轴方向的偏移
    currentX: 0,    // 当前x的值
    width: 0,       // 容器宽度
    bodyHeight: 0,  // 内容高度
    buttonWidth: 0, // 按钮容器的宽度
  },
  options: {multipleSlots: true},

  relations: {
    './slider-list': {
      type: 'parent',
      linked(target)
      {
        this.parent = target;
      }
    }
  },

  methods: {
    handleMovableChange(e)
    {
      this.currentX = e.detail.x;
    },
    handleTouchEnd(e)
    {
      let threshold = this.data.buttonWidth * 0.6;
      if (this.currentX < -threshold) {
        this.setData({x: -this.data.buttonWidth});
      } else {
        this.reset();
      }
    },

    reset()
    {
      this.setData({x: 0});
    },

    handleToucheStart(e)
    {
      this.parent.reset(this)
    }
  },
  ready()
  {
    // 容器宽度
    WX.size("#width", this).subscribe(res => this.setData({width: res.width}));
    setTimeout(() => {
      WX.size(".body", this).subscribe(res => this.setData({bodyHeight: res.height}));
      WX.size(".buttons", this).subscribe(res => this.data.buttonWidth = res.width);
    }, 100)
  }
});
