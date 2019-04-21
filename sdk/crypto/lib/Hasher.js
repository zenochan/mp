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
var BufferedBlockAlgorithm_1 = require("../lib/BufferedBlockAlgorithm");
var Hasher = /** @class */ (function (_super) {
    __extends(Hasher, _super);
    /**
     * Initializes a newly created hasher.
     *
     * @param cfg (Optional) The configuration options to use for this hash computation.
     *
     * @example
     *
     *     let hasher = CryptoJS.algo.SHA256.create();
     */
    function Hasher(cfg) {
        var _this = 
        // Apply config defaults
        _super.call(this, Object.assign({
            blockSize: 512 / 32
        }, cfg)) || this;
        // Set initial values
        _this.reset();
        return _this;
    }
    /**
     * Creates a shortcut function to a hasher's object interface.
     *
     * @param hasher The hasher to create a helper for.
     *
     * @return The shortcut function.
     *
     * @example
     *
     *     let SHA256 = Hasher._createHelper(SHA256);
     */
    Hasher._createHelper = function (hasher) {
        function helper(message, cfg) {
            var hasherClass = hasher;
            var hasherInstance = new hasherClass(cfg);
            return hasherInstance.finalize(message);
        }
        return helper;
    };
    /**
     * Updates this hasher with a message.
     *
     * @param messageUpdate The message to append.
     *
     * @return This hasher.
     *
     * @example
     *
     *     hasher.update('message');
     *     hasher.update(wordArray);
     */
    Hasher.prototype.update = function (messageUpdate) {
        // Append
        this._append(messageUpdate);
        // Update the hash
        this._process();
        // Chainable
        return this;
    };
    /**
     * Finalizes the hash computation.
     * Note that the finalize operation is effectively a destructive, read-once operation.
     *
     * @param messageUpdate (Optional) A final message update.
     *
     * @return The hash.
     *
     * @example
     *
     *     let hash = hasher.finalize();
     *     let hash = hasher.finalize('message');
     *     let hash = hasher.finalize(wordArray);
     */
    Hasher.prototype.finalize = function (messageUpdate) {
        // Final message update
        if (messageUpdate) {
            this._append(messageUpdate);
        }
        // Perform concrete-hasher logic
        var hash = this._doFinalize();
        return hash;
    };
    return Hasher;
}(BufferedBlockAlgorithm_1.BufferedBlockAlgorithm));
exports.Hasher = Hasher;
//# sourceMappingURL=Hasher.js.map