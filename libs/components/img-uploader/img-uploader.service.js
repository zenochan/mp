"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var api_service_1 = require("../../service/api.service");
var DefaultImageOperator = /** @class */ (function () {
    function DefaultImageOperator() {
    }
    DefaultImageOperator.prototype.upload = function (options) {
        return api_service_1.API.uploadMore(options.images);
    };
    DefaultImageOperator.prototype.remove = function () {
        var images = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            images[_i] = arguments[_i];
        }
        return api_service_1.API.post("delete", { photos: images });
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
//# sourceMappingURL=img-uploader.service.js.map