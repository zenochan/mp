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
var BlockCipherMode_1 = require("./BlockCipherMode");
var CBCEncryptor_1 = require("./CBCEncryptor");
var CBCDecryptor_1 = require("./CBCDecryptor");
/**
 * Cipher Block Chaining mode.
 */
var CBC = /** @class */ (function (_super) {
    __extends(CBC, _super);
    function CBC() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CBC.Encryptor = CBCEncryptor_1.CBCEncryptor;
    CBC.Decryptor = CBCDecryptor_1.CBCDecryptor;
    return CBC;
}(BlockCipherMode_1.BlockCipherMode));
exports.CBC = CBC;
//# sourceMappingURL=CBC.js.map