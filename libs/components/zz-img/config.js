"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ZZ_IMG_CONFIG = /** @class */ (function () {
    function ZZ_IMG_CONFIG() {
    }
    ZZ_IMG_CONFIG.BASE_URL = "http://127.0.0.1/";
    ZZ_IMG_CONFIG.ratio = 2;
    return ZZ_IMG_CONFIG;
}());
exports.ZZ_IMG_CONFIG = ZZ_IMG_CONFIG;
wx.getSystemInfo({
    success: function (res) {
        ZZ_IMG_CONFIG.ratio = res.pixelRatio;
    }
});
//# sourceMappingURL=config.js.map