import {Events} from "./Events";

const KEY_USER = "user_181127";

export class Data
{
  static getUser<T>(): T
  {
    let user = wx.getStorageSync(KEY_USER);
    // if(user){
    //   user.api_token = "89dcf1966e8cf79d91b863c0a11773c1";
    // }
    return user;
  }

  static setUser<T>(user: T)
  {
    // user['api_token'] = "89dcf1966e8cf79d91b863c0a11773c1";
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


  /**
   * 获取事件绑定的数据
   * @param e {Event}
   * @param key {string}
   */
  static eData<T>(e: any, key: string = "data"): T
  {
    return e.currentTarget.dataset[key]
  }

  static clear()
  {
    wx.clearStorage()
  }
}
