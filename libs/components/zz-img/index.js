"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var mp_1 = require("../../mp");
Component({
    properties: {
        src: {
            type: String, value: '', observer: function (src) {
                if (src.indexOf('http') != 0 && src.indexOf('/assets/') != 0 && config_1.ZZ_IMG_CONFIG.BASE_URL.indexOf("http") == 0) {
                    this.setData({ _src: config_1.ZZ_IMG_CONFIG.BASE_URL + src });
                }
                else {
                    this.setData({ _src: src });
                }
            },
        },
        view: { type: Boolean, value: false },
        qiniu: { type: Boolean, value: false },
        mode: {
            type: String, value: null, observer: function (value) {
                if (value)
                    this.setData({ mode: value });
            }
        },
        scaleToFill: {
            type: Boolean, value: false, observer: function (value) {
                if (value)
                    this.setData({ mode: 'scaleToFill' });
            }
        },
        aspectFit: {
            type: Boolean, value: false, observer: function (value) {
                if (value)
                    this.setData({ mode: 'aspectFit' });
            }
        },
        aspectFill: {
            type: Boolean, value: false, observer: function (value) {
                if (value)
                    this.setData({ mode: 'aspectFill' });
            }
        },
        widthFix: {
            type: Boolean, value: false, observer: function (value) {
                if (value)
                    this.setData({ mode: 'widthFix' });
            }
        },
    },
    methods: {
        preview: function () {
            this.data.view && this.data._src && wx.previewImage({ urls: [this.data._src] });
        }
    },
    ready: function () {
        var _this = this;
        mp_1.WX.size("#zz-img__size", this).subscribe(function (res) {
            res.width = res.width * config_1.ZZ_IMG_CONFIG.ratio;
            res.height = res.height * config_1.ZZ_IMG_CONFIG.ratio;
            _this.setData({ size: res });
            if (res.width * res.height == 0 && _this.data.qiniu) {
                _this.setData({ qiniu: false });
            }
        });
    }
});
//# sourceMappingURL=index.js.map