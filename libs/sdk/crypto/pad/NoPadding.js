"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NoPadding = /** @class */ (function () {
    function NoPadding() {
    }
    /**
     * Doesn't pad the data provided.
     *
     * @param data The data to pad.
     * @param blockSize The multiple that the data should be padded to.
     *
     * @example
     *
     *     NoPadding.pad(wordArray, 4);
     */
    NoPadding.pad = function (data, blockSize) {
    };
    /**
     * Doesn't unpad the data provided.
     *
     * @param data The data to unpad.
     *
     * @example
     *
     *     NoPadding.unpad(wordArray);
     */
    NoPadding.unpad = function (data) {
    };
    return NoPadding;
}());
exports.NoPadding = NoPadding;
// type guard for the padding (to ensure it has the required static methods)
var _ = NoPadding;
//# sourceMappingURL=NoPadding.js.map