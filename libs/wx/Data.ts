import {Events} from "./Events";

const KEY_USER = "user_181127";

export class Data
{
  static getUser<T>(): T
  {
    return wx.getStorageSync(KEY_USER);
  }

  static setUser<T>(user: T)
  {
    wx.setStorageSync(KEY_USER, user);
    user && Events.publish("user:update", user);
  }

  /**
   * @param key 建议使用蛇形 key
   */
  static get(key: string): any
  {
    if (!key) return null;
    return wx.getStorageSync(key)
  }

  static set(key: string, value: any)
  {
    if (!key) return;
    wx.setStorageSync(key, value)
  }

  static setAsync(key: string, value: any)
  {
    if (!key) return;
    wx.setStorage({
      key: key,
      data: value
    })
  }

  static clear()
  {
    wx.clearStorage()
  }
}
