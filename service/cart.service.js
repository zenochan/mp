"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mp_1 = require("../libs/mp");
/**
 * 购物车工具类
 * - 存储和是否选中
 * - 不提供检查库存的功能，不合适
 *
 * ## TOTO
 * - 同一产品不通属性怎么处理
 *
 * @deprecated 未完善
 */
var CartService = /** @class */ (function () {
    function CartService() {
    }
    CartService.actuallyKey = function (key) {
        var user = mp_1.Data.getUser() || { id: 'guest' };
        var userId = user.id || 'guest';
        // key:user
        return (key || this.DEFAULT_KEY) + ":" + userId;
    };
    CartService.get = function (key) {
        return wx.getStorageSync(this.actuallyKey(key)) || [];
    };
    CartService.save = function (carts, key) {
        wx.setStorageSync(this.actuallyKey(), carts);
    };
    CartService.add = function (cart, key) {
        if (!Array.isArray(cart))
            cart = [cart];
        var carts = this.get(key);
        cart.forEach(function (newItem) {
            var item = carts.find(function (cart) { return cart.id == newItem.id; });
            if (!item) {
                newItem.count = 0;
                newItem.selected = true;
                carts.push(newItem);
            }
            else {
                item.count += newItem.count;
            }
            if (item.count <= 0) {
                var index = carts.findIndex(function (cart) { return cart.id == item.id; });
                carts.splice(index, 1);
            }
        });
        this.save(carts, key);
    };
    CartService.remove = function (cart, key) {
        var carts = this.get(key);
        if (!Array.isArray(cart))
            cart = [cart];
        var idsToRemove = cart.map(function (item) { return item.id; });
        carts = carts.filter(function (item) { return idsToRemove.indexOf(item.id) == -1; });
        this.save(carts, key);
    };
    CartService.toggleSelect = function (cart, key) {
        var carts = this.get(key);
        carts.forEach(function (item) {
            if (item.id == cart.id) {
                item.selected = !cart.selected;
            }
        });
        this.save(carts);
    };
    CartService.clear = function (key) {
        mp_1.Data.set(this.actuallyKey(key), null);
    };
    CartService.DEFAULT_KEY = 'cart';
    return CartService;
}());
exports.CartService = CartService;
//# sourceMappingURL=cart.service.js.map