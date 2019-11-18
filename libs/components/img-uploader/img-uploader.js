"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * # properties
 *
 * - cameraOnly 仅允许相机拍照
 * - count 最大数量，默认9
 * - text 上传按钮提示文字
 * - disabled 只读
 * - scope 存储空间（前缀）
 * - urls
 * - url
 *
 * # events
 * - change 数据改变, 当 [count == 1] 时， 携带的数据不是数组
 */
var UI_1 = require("../../wx/UI");
var WX_1 = require("../../wx/WX");
var img_uploader_service_1 = require("./img-uploader.service");
var config_1 = require("../zz-img/config");
Component({
    data: {
        uploading: [],
    },
    options: {
        addGlobalClass: true
    },
    properties: {
        urls: {
            type: Array, value: [], observer: function (newVal) {
                if (!newVal) {
                    this.setData({ urls: [] });
                }
                this.completeImgUrl();
            }
        },
        url: {
            type: String, value: "", observer: function (newVal) {
                if (newVal) {
                    this.setData({ urls: [newVal] });
                    this.completeImgUrl();
                }
            }
        },
        disabled: { type: Boolean, value: false },
        /** 最大数量, 默认 9 */
        count: { type: Number, value: 9 },
        /** 是否允许从相册选择 */
        cameraOnly: { type: Boolean, value: false },
        text: { type: String, value: "上传图片" },
        scope: { type: String, value: "" }
    },
    methods: {
        chooseImage: function () {
            var _this = this;
            var from = ['camera'];
            if (!this.data.cameraOnly) {
                from.unshift("album");
            }
            WX_1.WX.chooseImage(this.data.count - this.data.urls.length, from)
                .flatMap(function (filePaths) {
                _this.setData({ uploading: filePaths });
                return img_uploader_service_1.ImgUploaderService.imageOperator.upload({ images: filePaths, scope: _this.data.scope });
            }) // 上传
                .subscribe(function (res) {
                var _a;
                (_a = _this.data.urls).push.apply(_a, res);
                _this.setData({
                    urls: _this.data.urls,
                    uploading: []
                });
                _this.triggerChange();
            }, function (e) {
                if (typeof e == "string")
                    UI_1.UI.toastFail(e, 2000);
                _this.setData({ uploading: [] });
            });
        },
        removeImage: function (event) {
            var _this = this;
            UI_1.UI.confirm("是否要删除图片?").subscribe(function (res) {
                var deleted = _this.data.urls.splice(event.currentTarget.dataset.index, 1);
                img_uploader_service_1.ImgUploaderService.imageOperator.remove(deleted)
                    .subscribe(function (res) { }, function (e) { return console.error("图片删除失败", e); });
                _this.setData({ urls: _this.data.urls });
                _this.triggerChange();
            });
        },
        triggerChange: function () {
            if (this.data.count == 1) {
                this.triggerEvent("change", { value: this.data.urls[0] || null });
            }
            else {
                this.triggerEvent("change", { value: this.data.urls });
            }
        },
        view: function (e) {
            var url = e.currentTarget.dataset.url;
            var urls = e.currentTarget.dataset.urls;
            wx.previewImage({
                current: url,
                urls: urls
            });
        },
        completeImgUrl: function () {
            var change = false;
            var urls = [];
            this.data.urls.forEach(function (url) {
                if (url.indexOf('http') != 0 && url.indexOf('/assets/') != 0 && config_1.ZZ_IMG_CONFIG.BASE_URL.indexOf("http") == 0) {
                    url = config_1.ZZ_IMG_CONFIG.BASE_URL + url;
                    change = true;
                }
                urls.push(url);
            });
            if (change) {
                this.setData({ urls: urls });
            }
        }
    },
});
//# sourceMappingURL=img-uploader.js.map