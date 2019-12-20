import {ZZ_IMG_CONFIG} from "./config";

Component({
  properties: {
    src: {
      type: String, value: '', observer(src: string)
      {
        if (src.indexOf('http') != 0 && src.indexOf('/assets/') != 0 && ZZ_IMG_CONFIG.BASE_URL.indexOf("http") == 0) {
          this.setData({src: ZZ_IMG_CONFIG.BASE_URL + src})
        }
      },
    },

    mode: {
      type: String, value: null, observer(value)
      {
        if (value) this.setData({mode: value});
      }
    },

    scaleToFill: {
      type: Boolean, value: false, observer(value)
      {
        if (value) this.setData({mode: 'scaleToFill'});
      }
    },
    aspectFit: {
      type: Boolean, value: false, observer(value)
      {
        if (value) this.setData({mode: 'aspectFit'});
      }
    },
    aspectFill: {
      type: Boolean, value: false, observer(value)
      {
        if (value) this.setData({mode: 'aspectFill'});
      }
    },
    widthFix: {
      type: Boolean, value: false, observer(value)
      {
        if (value) this.setData({mode: 'widthFix'});
      }
    },
  }
  ,
  methods: {
    view()
    {
      wx.previewImage({urls: [this.data.src]})
    }
  }
});
