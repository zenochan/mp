import {UI} from "./UI";
import {WX} from "./WX";

export class Nav
{
  private static navParams;
  public static INDEX = "/pages/index/index";

  static nav(url: string): boolean
  {

    if (url.indexOf("pages/") == 0) {
      url = '/' + url;
    }

    wx.navigateTo({
      url: url,
      fail: res => {
        if (res.errMsg.indexOf("can not navigateTo a tabbar page") != -1) {
          this.switchTab(url)
        } else {
          UI.toastFail(res.errMsg, 3000)
        }
      }
    });
    return true
  }

  /**
   * @param holder
   * @param url
   * @param data
   */
  static navForResult(holder: any, url: string, data?: any): Promise<any>
  {
    this.navParams = data;
    let page = WX.page();
    page.holder = holder;

    this.nav(url);
    return new Promise(resolve => {
      (page.holder as any).onResult = function (data) {
        resolve(data)
      }
    });
  }


  static navData(): any | null
  {
    return this.navParams || null;
  }

  static switchTab(page: string)
  {
    wx.switchTab({
      url: page,
      fail: res => UI.toastFail(res.errMsg, 2000)
    })
  }

  static navBack(data?: any)
  {
    wx.navigateBack();
    let pages = getCurrentPages();
    let prePage = pages[pages.length - 2];
    if (prePage && prePage.holder) {
      let cb = (prePage.holder as any).onResult;
      cb && cb(data);
      (prePage.holder as any).onResult = null;
    }
  }

  static navBackOrIndex()
  {
    if (getCurrentPages().length > 1) {
      wx.navigateBack()
    } else {
      wx.reLaunch({url: this.INDEX})
    }
  }
}
