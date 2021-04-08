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
        files: [],
    },
    options: {
        addGlobalClass: true,
    },
    properties: {
        urls: {
            type: Array,
            value: [],
            observer: function (newVal) {
                this.handleUrls(newVal);
            },
        },
        url: {
            type: String,
            value: '',
            observer: function (newVal) {
                if (newVal) {
                    this.handleUrls([newVal]);
                }
                else {
                    this.setData({ urls: [], files: [] });
                }
            },
        },
        /**
         * - image
         * - video
         * - media
         */
        type: {
            type: String, value: 'image',
        },
        disabled: { type: Boolean, value: false },
        /** 最大数量, 默认 9 */
        count: { type: Number, value: 9 },
        /** 是否允许从相册选择 */
        cameraOnly: { type: Boolean, value: false },
        text: { type: String, value: '上传图片' },
        scope: { type: String, value: '' },
    },
    methods: {
        chooseMedia: function () {
            var _this = this;
            var _a = this.data, urls = _a.urls, count = _a.count, cameraOnly = _a.cameraOnly, type = _a.type;
            var sourceType = ['camera'];
            if (!cameraOnly) {
                sourceType.unshift('album');
            }
            var mediaType = {
                media: ['image', 'video'],
                image: ['image'],
                video: ['video'],
            }[type];
            WX_1.WX.chooseMedia({ count: count - urls.length, sourceType: sourceType, mediaType: mediaType })
                .flatMap(function (tempFiles) {
                var tempFilePaths = tempFiles.map(function (file) { return file.tempFilePath; });
                _this.setData({ uploading: tempFiles });
                return img_uploader_service_1.ImgUploaderService.imageOperator.upload({ images: tempFilePaths, scope: _this.data.scope });
            }) // 上传
                .subscribe(function (res) {
                var _a;
                (_a = _this.data.files).push.apply(_a, _this.mapUrlsToFiles(res));
                _this.setData({
                    files: _this.data.files,
                    uploading: [],
                });
                _this.triggerChange();
            }, function (e) {
                if (typeof e === 'string')
                    UI_1.UI.toastFail(e, 2000);
                _this.setData({ uploading: [] });
            });
        },
        removeItem: function (event) {
            var _this = this;
            UI_1.UI.confirm('是否删除?').subscribe(function () {
                var deleted = _this.data.files.splice(event.currentTarget.dataset.index, 1);
                _this.setData({ files: _this.data.files });
                _this.triggerChange();
                img_uploader_service_1.ImgUploaderService.imageOperator.remove(deleted[0].url)
                    .subscribe(function () { return null; }, function (e) { return console.error('删除失败', e); });
            });
        },
        triggerChange: function () {
            var urls = this.data.files.map(function (file) { return file.url; });
            var value = this.data.count === 1 ? urls[0] || null : urls;
            this.triggerEvent('change', { value: value });
        },
        view: function (e) {
            var index = e.currentTarget.dataset.index;
            var current = this.data.files[index];
            if (wx.previewMedia) {
                wx.previewMedia({
                    url: current.url,
                    sources: this.data.files.map(function (file) { return ({
                        url: file.url,
                        type: file.isImage ? 'image' : 'video',
                    }); }),
                });
            }
            else if (current.isImage) {
                var urls = this.data.files.filter(function (file) { return file.isImage; }).map(function (file) { return file.url; });
                wx.previewImage({ current: current.url, urls: urls });
            }
            else {
                UI_1.UI.toastFail('您的微信版本不支持预览视频');
            }
        },
        handleUrls: function (urls) {
            this.setData({ files: this.mapUrlsToFiles(urls) });
        },
        mapUrlsToFiles: function (urls) {
            return urls.map(function (url) {
                var validUrl = url;
                var invalidUrl = !url.startsWith('http') && !url.includes('assets');
                var validBaseUrl = config_1.ZZ_IMG_CONFIG.BASE_URL.startsWith('http');
                if (invalidUrl && validBaseUrl) {
                    validUrl = config_1.ZZ_IMG_CONFIG.BASE_URL + url;
                }
                return {
                    url: validUrl,
                    isVideo: /.(mp4|avi|flv|mov|rm|rmvb|3gp)/.test(url.toLowerCase()),
                    isImage: /.(jpg|jpeg|png|gif)/.test(url.toLowerCase()),
                };
            });
        },
    },
});
//# sourceMappingURL=index.js.map