"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var BlockCipherModeAlgorithm_1 = require("./BlockCipherModeAlgorithm");
var ECBDecryptor = /** @class */ (function (_super) {
    __extends(ECBDecryptor, _super);
    function ECBDecryptor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Processes the data block at offset.
     *
     * @param words The data words to operate on.
     * @param offset The offset where the block starts.
     *
     * @example
     *
     *     mode.processBlock(data.words, offset);
     */
    ECBDecryptor.prototype.processBlock = function (words, offset) {
        this._cipher.decryptBlock(words, offset);
    };
    return ECBDecryptor;
}(BlockCipherModeAlgorithm_1.BlockCipherModeAlgorithm));
exports.ECBDecryptor = ECBDecryptor;
//# sourceMappingURL=ECBDecryptor.js.map