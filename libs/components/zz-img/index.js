"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var mp_1 = require("../../mp");
Component({
    data: {
        placeholder: true,
        mode: 'aspectFill',
        width: null,
        specialSize: null
    },
    options: {
        addGlobalClass: true
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
                this.getImgSize();
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
                var _this = this;
                value && wx.nextTick(function () { return _this.setData({ mode: 'scaleToFill' }); });
            }
        },
        aspectFit: {
            type: Boolean, value: false, observer: function (value) {
                var _this = this;
                value && wx.nextTick(function () { return _this.setData({ mode: 'aspectFit' }); });
            }
        },
        aspectFill: {
            type: Boolean, value: false, observer: function (value) {
                var _this = this;
                value && wx.nextTick(function () { return _this.setData({ mode: 'aspectFill' }); });
            }
        },
        widthFix: {
            type: Boolean, value: false, observer: function (value) {
                var _this = this;
                value && wx.nextTick(function () {
                    _this.setData({ mode: 'widthFix' });
                    _this.getImgSize();
                });
            }
        },
    },
    methods: {
        preview: function () {
            this.data.view && this.data._src && wx.previewImage({ urls: [this.data._src] });
        },
        loadSuccess: function () {
            var _this = this;
            wx.nextTick(function () {
                _this.setData({ placeholder: false });
            });
        },
        loadFail: function () {
            var _this = this;
            wx.nextTick(function () {
                _this.setData({ placeholder: true });
            });
        },
        getImgSize: function () {
            var _this = this;
            if (!this.data._src || this.data.mode != 'widthFix')
                return;
            wx.getImageInfo({
                src: this.data._src,
                success: function (res) {
                    var fun = function () {
                        if (_this.data.width) {
                            var height_1 = (_this.data.width * res.height / res.width).toFixed(1);
                            wx.nextTick(function () {
                                _this.setData({ specialSize: "width:" + _this.data.width + "px;height: " + height_1 + "px" });
                            });
                        }
                        else {
                            setTimeout(fun, 100);
                        }
                    };
                    fun();
                }
            });
        }
    },
    ready: function () {
        var _this = this;
        mp_1.WX.size(".zz-img__ctn", this).subscribe(function (res) { return _this.data.width = res.width; });
        this.data.qiniu && mp_1.WX.size(".zz-img__size", this).subscribe(function (res) {
            res.width = res.width * config_1.ZZ_IMG_CONFIG.ratio;
            res.height = res.height * config_1.ZZ_IMG_CONFIG.ratio;
            _this.setData({ size: res });
            if (res.width * res.height == 0 && _this.data.qiniu) {
                _this.setData({ qiniu: false });
            }
        });
    },
});
//# sourceMappingURL=index.js.map