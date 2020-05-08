import {ZZ_IMG_CONFIG} from "./config";
import {WX} from "../../mp";

Component({
  data: {
    placeholder: true,
    mode: 'aspectFill',
    width: null,          // 组件的宽度
    specialSize: null
  },
  options: {
    addGlobalClass: true
  },

  properties: {
    src: {
      type: String, value: '', observer: function (src: string) {
        if (src.indexOf('assets') != -1) {
          this.setData({_src: src, placeholder: false})
        } else if (!src) {
          this.setData({_src: null})
        } else if (src.indexOf('http') != 0 && ZZ_IMG_CONFIG.BASE_URL.indexOf("http") == 0) {
          this.setData({_src: ZZ_IMG_CONFIG.BASE_URL + src})
        } else {
          this.setData({_src: src})
        }
        this.getImgSize();
      },
    },

    view: {type: Boolean, value: false},

    qiniu: {type: Boolean, value: false},

    mode: {
      type: String, value: null, observer: function (value) {
        if (value) this.setData({mode: value});
      }
    },

    scaleToFill: {
      type: Boolean, value: false, observer: function (value) {
        value && wx.nextTick(() => this.setData({mode: 'scaleToFill'}));
      }
    },
    aspectFit: {
      type: Boolean, value: false, observer: function (value) {
        value && wx.nextTick(() => this.setData({mode: 'aspectFit'}));
      }
    },
    aspectFill: {
      type: Boolean, value: false, observer: function (value) {
        value && wx.nextTick(() => this.setData({mode: 'aspectFill'}));
      }
    },
    widthFix: {
      type: Boolean, value: false, observer: function (value) {
        value && wx.nextTick(() => {
          this.setData({mode: 'widthFix'});
          this.getImgSize();
        });
      }
    },
  }
  ,
  methods: {
    preview() {
      this.data.view && this.data._src && wx.previewImage({urls: [this.data._src]})
    },

    loadSuccess() {
      wx.nextTick(() => {
        this.setData({placeholder: false});
      })
    },

    loadFail() {
      wx.nextTick(() => {
        this.setData({placeholder: true});
      })
    },

    getImgSize() {
      if (!this.data._src || this.data.mode != 'widthFix') return;
      wx.getImageInfo({
        src: this.data._src,
        success: res => {
          let fun = () => {
            if (this.data.width) {
              let height = (this.data.width * res.height / res.width).toFixed(1);
              wx.nextTick(() => {
                this.setData({specialSize: `width:${this.data.width}px;height: ${height}px`});
              })
            } else {
              setTimeout(fun, 100)
            }
          }

          fun();
        }
      })
    }
  },

  ready() {
    WX.size(".zz-img__ctn", this).subscribe(res => this.data.width = res.width)

    this.data.qiniu && WX.size(".zz-img__size", this).subscribe(res => {
      res.width = res.width * ZZ_IMG_CONFIG.ratio;
      res.height = res.height * ZZ_IMG_CONFIG.ratio;

      this.setData({size: res});
      if (res.width * res.height == 0 && this.data.qiniu) {
        this.setData({qiniu: false});
      }
    })
  },
});
