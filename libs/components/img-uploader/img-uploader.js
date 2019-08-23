"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * # properties
 *
 * - cameraOnly 仅允许相机拍照
 * - count 最大数量，默认9
 * - text 上传按钮提示文字
 * - disabled 只读
 *
 * # events
 * - change 数据改变
 */
var UI_1 = require("../../wx/UI");
var WX_1 = require("../../wx/WX");
var img_uploader_service_1 = require("./img-uploader.service");
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
                if (!newVal)
                    this.setData({ urls: [] });
            }
        },
        disabled: { type: Boolean, value: false },
        /** 最大数量, 默认 9 */
        count: { type: Number, value: 9 },
        /** 是否允许从相册选择 */
        cameraOnly: { type: Boolean, value: false },
        text: { type: String, value: "上传作品" }
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
                return img_uploader_service_1.ImgUploaderService.imageOperator.upload(filePaths);
            }) // 上传
                .subscribe(function (res) {
                var _a;
                (_a = _this.data.urls).push.apply(_a, res);
                _this.setData({
                    urls: _this.data.urls,
                    uploading: []
                });
                _this.triggerEvent("change", { value: _this.data.urls });
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
                _this.triggerEvent("change", { value: _this.data.urls });
            });
        },
        view: function (e) {
            var url = e.currentTarget.dataset.url;
            var urls = e.currentTarget.dataset.urls;
            wx.previewImage({
                current: url,
                urls: urls
            });
        }
    },
});
//# sourceMappingURL=img-uploader.js.map