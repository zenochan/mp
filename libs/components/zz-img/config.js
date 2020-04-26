"use strict";
exports.__esModule = true;
var mp_1 = require("../../mp");
var ZZ_IMG_CONFIG = /** @class */ (function () {
    function ZZ_IMG_CONFIG() {
    }
    ZZ_IMG_CONFIG.BASE_URL = "http://127.0.0.1/";
    ZZ_IMG_CONFIG.ratio = 2;
    return ZZ_IMG_CONFIG;
}());
exports.ZZ_IMG_CONFIG = ZZ_IMG_CONFIG;
mp_1.WX.systemInfo().subscribe(function (info) { return ZZ_IMG_CONFIG.ratio = info.pixelRatio; });
