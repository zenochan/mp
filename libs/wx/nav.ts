import {UI} from "./UI";
import {WX} from "./WX";

export class Nav
{
  private static navParams;
  public static INDEX = "/pages/index/index";

  static nav(url: string): boolean
  {
    if (/^(pages|package)/.test(url)) {
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

  /**
   * 数据有变化， 上一个页面需要刷新
   */
  static refreshPre()
  {
    WX.pagePre().subscribe(page => page.onceRefresh = true);
  }

  static navBack(data?: any)
  {
    let pages = getCurrentPages();
    let prePage = pages[pages.length - 2];
    if (prePage && prePage.holder) {
      // 需要等待上衣页面 onShow 后再传回参数, 否则后续页面的 modal 会在当前页面出现，然后跟随页面消失
      prePage.zzLife().filter(res => res == "onShow").take(1).subscribe(res => {
        let cb = (prePage.holder as any).onResult;
        cb && cb(data);
        (prePage.holder as any).onResult = null;
      });
    }

    wx.navigateBack();
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
