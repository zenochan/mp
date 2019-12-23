"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
Component({
    properties: {
        src: {
            type: String, value: '', observer: function (src) {
                if (src.indexOf('http') != 0 && src.indexOf('/assets/') != 0 && config_1.ZZ_IMG_CONFIG.BASE_URL.indexOf("http") == 0) {
                    this.setData({ src: config_1.ZZ_IMG_CONFIG.BASE_URL + src });
                }
            },
        },
        view: { type: Boolean, value: false },
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
        view: function () {
            if (this.data.view) {
                wx.previewImage({ urls: [this.data.src] });
            }
        }
    }
});
//# sourceMappingURL=index.js.map