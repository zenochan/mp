import {UIKit} from "./wx/uikit";

export class Nav
{
  static nav(url: string): boolean
  {
    wx.navigateTo({
      url: url,
      fail: res => UIKit.toastFail(res.errMsg, 3000)
    });
    return true
  }

  /**
   * @param page
   * @param url
   * @param data
   */
  static navForResult(page: IPage, url: string, data?: any): Promise<any>
  {
    page.navData = data;

    this.nav(url);
    return new Promise(resolve => {
      page.onResult = function (data) {
        resolve(data)
      }
    });
  }

  static navData(): any | null
  {
    let pages: any[] = getCurrentPages();
    if (pages.length <= 1) return null;
    return pages[pages.length - 2].navData
  }

  static navBack(data?: any)
  {
    let pages = getCurrentPages();
    let prePage = pages[pages.length - 2];
    wx.navigateBack();
    let cb = (prePage as any).onResult;
    cb && cb(data);
    (prePage as any).onResult = null;
  }

  static navBackOrReLaunch(relaunchPage: string = "/pages/index/index")
  {
    if (getCurrentPages().length > 1) {
      wx.navigateBack()
    } else {
      wx.reLaunch({url: relaunchPage})
    }
  }
}
