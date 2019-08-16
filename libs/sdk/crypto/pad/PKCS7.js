"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WordArray_1 = require("../lib/WordArray");
var PKCS7 = /** @class */ (function () {
    function PKCS7() {
    }
    /**
     * Pads data using the algorithm defined in PKCS #5/7.
     *
     * @param data The data to pad.
     * @param blockSize The multiple that the data should be padded to.
     *
     * @example
     *
     *     PKCS7.pad(wordArray, 4);
     */
    PKCS7.pad = function (data, blockSize) {
        // Shortcut
        var blockSizeBytes = blockSize * 4;
        // Count padding bytes
        var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;
        // Create padding word
        var paddingWord = (nPaddingBytes << 24) | (nPaddingBytes << 16) | (nPaddingBytes << 8) | nPaddingBytes;
        // Create padding
        var paddingWords = [];
        for (var i = 0; i < nPaddingBytes; i += 4) {
            paddingWords.push(paddingWord);
        }
        var padding = new WordArray_1.WordArray(paddingWords, nPaddingBytes);
        // Add padding
        data.concat(padding);
    };
    /**
     * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
     *
     * @param data The data to unpad.
     *
     * @example
     *
     *     PKCS7.unpad(wordArray);
     */
    PKCS7.unpad = function (data) {
        // Get number of padding bytes from last byte
        var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;
        // Remove padding
        data.sigBytes -= nPaddingBytes;
    };
    return PKCS7;
}());
exports.PKCS7 = PKCS7;
// type guard for the formatter (to ensure it has the required static methods)
var _ = PKCS7;
//# sourceMappingURL=PKCS7.js.map