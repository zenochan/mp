"use strict";
exports.__esModule = true;
var BlockCipherModeAlgorithm = /** @class */ (function () {
    function BlockCipherModeAlgorithm(cipher, iv) {
        this.init(cipher, iv);
    }
    /**
     * Initializes a newly created mode.
     *
     * @param cipher A block cipher instance.
     * @param iv The IV words.
     *
     * @example
     *
     *     var mode = CBC.Encryptor.create(cipher, iv.words);
     */
    BlockCipherModeAlgorithm.prototype.init = function (cipher, iv) {
        this._cipher = cipher;
        this._iv = iv;
    };
    return BlockCipherModeAlgorithm;
}());
exports.BlockCipherModeAlgorithm = BlockCipherModeAlgorithm;
//# sourceMappingURL=BlockCipherModeAlgorithm.js.map