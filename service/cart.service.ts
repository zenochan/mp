import {Data} from "../libs/mp";

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
export class CartService
{
  private static DEFAULT_KEY = 'cart';

  private static actuallyKey(key?: string)
  {
    let user = Data.getUser<any>() || {id: 'guest'};
    let userId = user.id || 'guest';
    // key:user
    return `${key || this.DEFAULT_KEY}:${userId}`;
  }

  public static get(key: string): Cart[]
  {
    return wx.getStorageSync(this.actuallyKey(key)) || []
  }

  public static save(carts: Cart[], key?: string)
  {
    wx.setStorageSync(this.actuallyKey(), carts)
  }

  public static add<T>(cart: Cart | Cart[], key?: string)
  {
    if (!Array.isArray(cart)) cart = [cart];

    let carts = this.get(key);
    cart.forEach(newItem => {
      let item: Cart = carts.find(cart => cart.id == newItem.id);

      if (!item) {
        newItem.count = 0;
        newItem.selected = true;
        carts.push(newItem);
      } else {
        item.count += newItem.count;
      }
      if (item.count <= 0) {
        let index = carts.findIndex(cart => cart.id == item.id);
        carts.splice(index, 1);
      }
    });

    this.save(carts, key)
  }

  public static remove(cart: Cart | Cart[], key?: string)
  {
    let carts = this.get(key);
    if (!Array.isArray(cart)) cart = [cart];
    let idsToRemove = cart.map(item => item.id);

    carts = carts.filter(item => idsToRemove.indexOf(item.id) == -1);
    this.save(carts, key);
  }

  public static toggleSelect(cart: Cart, key?: string)
  {
    let carts = this.get(key);

    carts.forEach((item) => {
      if (item.id == cart.id) {
        item.selected = !cart.selected;
      }
    });
    this.save(carts)
  }

  static clear(key?: string)
  {
    Data.set(this.actuallyKey(key), null)
  }

}

interface Cart
{
  id: number | string         // 产品主键
  count: number               // 数量
  selected: boolean           // 是否选中
  data?: any                  // 产品数据
}

export interface CartTotal
{
  totalCount: Function;

  totalSelect: Function;
  totalFee: Function;
}
