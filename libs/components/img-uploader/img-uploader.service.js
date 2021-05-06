"use strict";
exports.__esModule = true;
exports.ImgUploaderService = exports.DefaultImageOperator = void 0;
var mp_1 = require("../../mp");
var DefaultImageOperator = /** @class */ (function () {
    function DefaultImageOperator() {
    }
    // eslint-disable-next-line class-methods-use-this
    DefaultImageOperator.prototype.upload = function (options) {
        return mp_1.API.uploadMore({ filePaths: options.images });
    };
    // eslint-disable-next-line class-methods-use-this
    DefaultImageOperator.prototype.remove = function () {
        var images = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            images[_i] = arguments[_i];
        }
        return mp_1.API.post('delete', { photos: images });
    };
    return DefaultImageOperator;
}());
exports.DefaultImageOperator = DefaultImageOperator;
var ImgUploaderService = /** @class */ (function () {
    function ImgUploaderService() {
    }
    ImgUploaderService.imageOperator = new DefaultImageOperator();
    return ImgUploaderService;
}());
exports.ImgUploaderService = ImgUploaderService;
