import {UI} from "./UI";
import {WX} from "./WX";


export class Nav
{
  private static navParams;
  public static INDEX = "/pages/index/index";

  static nav(options: string | {
    url: string,
    redirect?: boolean
  })
  {
    let op;
    if (typeof options == 'string') {
      op = {url: options};
    } else {
      op = options;
    }

    let to = Route.create(op.url);
    let from = Route.create(WX.page().route);
    runQueue(NavInjectors, (injector, next) => {
      if (injector.beforeNav) {
        injector.beforeNav(to, from, next);
      } else {
        next()
      }
    }, () => {
      this.actualNav(to, from, op.redirect)
    })
  }

  private static actualNav(to: Route, from: Route, redirect: boolean = false)
  {
    let options = {
      url: to.page(),
      fail: res => {
        if (res.errMsg.indexOf("can not navigateTo a tab bar page") != -1) {
          this.switchTab(to.page())
        } else if (res.errMsg.indexOf("fail page") != -1) {
          UI.toastFail("页面不存在");
          console.warn("页面不存在：" + to.page());
        } else {
          UI.toastFail(res.errMsg, 3000)
        }
      }
    }

    if (redirect || to.url == from.url) {
      wx.redirectTo(options);
    } else {
      wx.navigateTo(options);
    }
  }

  static redirect(url: string)
  {
    this.nav({url: url, redirect: true})
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


  /**
   * - 在 page 中调用 {@link IPage.navParams}
   */
  static navData(): any | null
  {
    return this.navParams
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

export class Route
{
  public url: string
  public query: string

  page()
  {
    let url = this.url;
    if (this.query) {
      url += '?' + this.query;
    }

    return url;
  }

  static create(path: string): Route
  {
    let route = new Route();
    route.url = this.checkUrl(path.split('?')[0])
    route.query = path.split('?')[1] || ''

    return route;
  }


  private static checkUrl(url: string)
  {
    if (/^(pages|package)/.test(url)) {
      url = '/' + url;
    }

    if (!/^\//.test(url)) {
      let currUrl = '/' + WX.page().route;
      url = currUrl.substring(0, currUrl.lastIndexOf('/')) + '/' + url;
      url = url.replace(/[^/]+\/\.\.\//, '')
          .replace(/\/\//g, '/');
    }

    return url;
  }
}

export interface NavInjector
{
  beforeNav?: (to: Route, from: Route, next: () => void) => void;
  afterNav?: (to: Route, from: Route) => void;
}

export const NavInjectors: Array<NavInjector> = [];

export function runQueue(
    queue: NavInjector[],
    fn: (injector: NavInjector, next: () => void) => void,
    cb: () => void
)
{
  let step = index => {
    if (index >= queue.length) {
      cb();
    } else {
      if (queue[index]) {
        fn(queue[index], () => step(index + 1))
      } else {
        step(index + 1)
      }
    }
  }

  step(0);
}
