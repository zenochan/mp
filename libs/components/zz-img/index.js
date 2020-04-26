"use strict";
exports.__esModule = true;
var config_1 = require("./config");
var mp_1 = require("../../mp");
Component({
    data: {
        placeholder: true,
        mode: 'aspectFill'
    },
    properties: {
        src: {
            type: String, value: '', observer: function (src) {
                if (src.indexOf('assets') != -1) {
                    this.setData({ _src: src, placeholder: false });
                }
                else if (!src) {
                    this.setData({ _src: null });
                }
                else if (src.indexOf('http') != 0 && config_1.ZZ_IMG_CONFIG.BASE_URL.indexOf("http") == 0) {
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
        },
        loadSuccess: function () {
            this.setData({ placeholder: false });
        },
        loadFail: function () {
            this.setData({ placeholder: true });
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
    },
});
