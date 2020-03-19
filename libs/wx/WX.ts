import Scope = wx.Scope;
import RequestPaymentOptions = wx.RequestPaymentOptions;
import UserInfo = wx.UserInfo;
import GetImageInfoResult = wx.GetImageInfoResult;
import CanvasToTempFilePathOptions = wx.CanvasToTempFilePathOptions;
import ScanCodeResult = wx.ScanCodeResult;
import * as Rx from "../rx/Rx";
import {BehaviorSubject, Observable} from "../rx/Rx";
import {UI} from "./UI";
import {rxJust} from "../mp";
import {rxEmpty} from "../rx/RxExt";

/**
 * 微信 API rx 封装
 *
 * # 开放接口
 */
export class WX
{
  static saveImageToPhotosAlbum(src)
  {
    WX.authorize("scope.writePhotosAlbum")
        .flatMap(res => WX.getImageInfo(src))
        .subscribe(res => {
          wx.saveImageToPhotosAlbum({
            filePath: res.path,
            success: () => UI.toastSuccess("图片已保存")
          });
        }, e => {
          if ((e.errMsg || "").indexOf("authorize:fail") != -1) {
            UI.showModal({
              title: "提示",
              content: "需要保存到相册权限, 是否现在去设置？",
              confirmText: "打开设置",
              cancelText: "取消"
            }).subscribe(res => wx.openSetting())
          } else {
            UI.toastFail(e)
          }
        })
  }

  /**
   * @see Scope
   */
  static SCOPE = {
    USER_INFO: "scope.userInfo",
    USER_LOCATION: "scope.userLocation",
    ADDRESS: "scope.address",
    INVOICE_TITLE: "scope.invoiceTitle",
    WE_RUN: "scope.werun",
    RECORD: "scope.record",
    WRITE_PHOTOS_ALBUM: "scope.writePhotosAlbum",
    CAMERA: "scope.camera"
  };

  static page(): IPage
  {
    let pages = getCurrentPages();
    return pages[pages.length - 1];
  }

  static pagePre(): Observable<IPage>
  {
    let pages = getCurrentPages();
    if (pages.length > 1) {
      return rxJust(pages[pages.length - 2]);
    } else {
      rxEmpty()
    }
  }

  /**
   * 小程序强制更新
   * @param delayMs 延时弹框，安卓上有时候不显示
   */
  static forceUpdate(delayMs: number = 100)
  {
    if (delayMs < 0) delayMs = 0;

    wx.getUpdateManager().onUpdateReady(() => {
      setTimeout(() => {
        UI.alert('需要重启小程序完成更新').subscribe(res => wx.getUpdateManager().applyUpdate());
      }, delayMs);
    });
  }


  /**
   * 是否是 iPhone X, 用于兼容底部导航, 底部添加 68rxp 高度;
   *
   * @see <a href="https://blog.csdn.net/weixin_39449961/article/details/80252895">微信小程序中的iPhone X适配问题</a>
   * @version 20190327
   * @author Zeno (zenochan@qq.com)
   */
  static isIphoneX(): Observable<boolean>
  {
    return Observable.create(sub => {
      return wx.getSystemInfo({
        success: res => {
          sub.next(res.model.indexOf("iPhone X") != -1)
        },
        fail: e => sub.error(e)
      })
    });
  }

  static systemInfo(): Observable<wx.GetSystemInfoResult>
  {
    return Observable.create(sub => {
      return wx.getSystemInfo({
        success: res => {
          sub.next(res)
        },
        fail: e => sub.error(e)
      })
    });
  }

  static navHeight(): Observable<number>
  {
    return WX.systemInfo().map(res => {
      let menuRounding = wx.getMenuButtonBoundingClientRect();
      return (menuRounding.top - res.statusBarHeight) * 2 + menuRounding.height
    });
  }

  static getLocation(): Observable<wx.GetLocationResult>
  {
    return Observable.create(sub => {
      return wx.getLocation({
        type: 'gcj02',
        altitude: true,
        success: res => {
          sub.next(res)
        },
        fail: e => sub.error(e)
      })
    });

  }


  /**
   * 是否是 iPhone
   *
   * @see <a href="https://blog.csdn.net/weixin_39449961/article/details/80252895">微信小程序中的iPhone X适配问题</a>
   * @version 20190327
   * @author Zeno (zenochan@qq.com)
   */
  static isIphone(): Observable<boolean>
  {
    return Observable.create(sub => {
      return wx.getSystemInfo({
        success: res => {
          sub.next(res.model.indexOf("iPhone") != -1)
        },
        fail: e => sub.error(e)
      })
    });
  }

  static onPageScroll(handler: (scrollTop) => void)
  {

    let pages = getCurrentPages();
    let page = pages[pages.length - 1];
    let origin = page.onPageScroll;
    page.onPageScroll = function (event) {
      origin && origin(event);
      handler(event.scrollTop);
    };
  }

  /**
   * @param timeout {@link LoginOptions.timeout}
   * @see wx.login
   * @return code string
   */
  static login(timeout?: number): Rx.Observable<string>
  {
    return Rx.Observable.create(emitter => {
      wx.login({
        timeout: timeout,
        success: res => emitter.next(res),
        fail: error => emitter.error(error),
        complete: () => emitter.complete()
      })
    }).map(res => res.code)
  }

  static checkSession(): Rx.Observable<boolean>
  {
    return Rx.Observable.create(emitter => {
      wx.checkSession({
        //session_key 未过期，并且在本生命周期一直有效
        success: () => emitter.next(true),
        // session_key 已经失效，需要重新执行登录流程
        fail: () => emitter.next(false),
        complete: () => emitter.complete()
      })
    });
  }

  /**
   * 扫码
   * @param scanType string[]  合法值
   *     - barCode  一维码
   *     - qrCode  二维码
   *     - datamatrix  Data Matrix 码
   *     - pdf417  PDF417 条码
   * @param onlyFromCamera
   */
  static scanCode(scanType: string[] = ["qrCode"], onlyFromCamera: boolean = true): Rx.Observable<ScanCodeResult>
  {
    return Rx.Observable.create(emitter => {
      wx.scanCode({
        scanType: scanType,
        onlyFromCamera,
        success: res => emitter.next(res),
        fail: err => emitter.error(err),
        complete: () => emitter.complete()
      })
    });
  }


  /**
   * @since v1.2.0
   * @see wx.getSetting
   */
  static getSetting(): Rx.Observable<Scope> | any
  {
    return Rx.Observable.create(emitter => {
      wx.getSetting({
        success: res => emitter.next(res),
        fail: error => emitter.error(error),
        complete: () => emitter.complete()
      })
    }).map(res => {
      const authSetting = res.authSetting;
      return {
        userInfo: authSetting[WX.SCOPE.USER_INFO] || false,
        userLocation: authSetting[WX.SCOPE.USER_LOCATION] || false,
        address: authSetting[WX.SCOPE.ADDRESS] || false,
        invoiceTitle: authSetting[WX.SCOPE.INVOICE_TITLE] || false,
        werun: authSetting[WX.SCOPE.WE_RUN] || false,
        record: authSetting[WX.SCOPE.RECORD] || false,
        writePhotosAlbum: authSetting[WX.SCOPE.WRITE_PHOTOS_ALBUM] || false,
        camera: authSetting[WX.SCOPE.CAMERA] || false,
      }
    })
  }


  static getUserInfo(): Rx.Observable<UserInfo>
  {
    return Rx.Observable.create(emitter => {
      wx.getUserInfo({
        success: res => emitter.next(res),
        fail: error => emitter.error(error),
        complete: () => emitter.complete()
      })
    })
  }

  /**
   * https://developers.weixin.qq.com/miniprogram/dev/api/open-api/authorize/wx.authorize.html
   */
  static authorize(scope: string): Rx.Observable<any>
  {
    return Rx.Observable.create(emitter => {
      wx.authorize({
        scope: scope,
        success: res => emitter.next(res),
        fail: error => emitter.error(error),
        complete: () => emitter.complete()
      })

    });
  }

  static requestPayment(sign: RequestPaymentOptions): Rx.Observable<any> | any
  {
    return Rx.Observable.create(emitter => {
      sign.success = () => emitter.next();
      sign.complete = () => emitter.complete();
      sign.fail = (e) => emitter.error(e.errMsg);
      wx.requestPayment(sign)
    })
  }

  static chooseImage(count: number = 1, sourceType: Array<string> = ['camera', 'album']): Observable<Array<string>>
  {
    return Rx.Observable.create(sub => {
      wx.chooseImage({
        count: count,
        sourceType: sourceType,
        success: res => sub.next(res.tempFilePaths),
        fail: e => {
          // 忽略取消错误
          if (e.errMsg.indexOf('cancel') == -1) sub.error(e)
        },
        complete: () => sub.complete()
      })
    });

  }


  /**
   * @see [wx.updateShareMenu](https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.updateShareMenu.html)
   */
  static updateShareMenu(withShareTicket: boolean): Rx.Observable<any>
  {
    return Rx.Observable.create((sub: Rx.Subscriber<any>) => {
      wx.updateShareMenu({
        withShareTicket: withShareTicket,
        success: res => sub.next(res),
        fail: e => sub.error(e),
        complete: () => sub.complete()
      })
    });
  }

  /**
   * @see [wx.showShareMenu](https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.showShareMenu.html)
   * @since 1.1.0
   */
  static showShareMenu(withShareTicket: boolean = false): Rx.Observable<any>
  {
    let sub = new BehaviorSubject().filter(res => res);

    wx.showShareMenu({
      withShareTicket: withShareTicket,
      success: res => sub.next(res),
      fail: e => sub.error(e),
      complete: () => sub.complete()
    });
    return sub;

  }

  static showActionSheet(items: string[], color: string = "#000000"): Rx.Observable<any>
  {
    return Rx.Observable.create((sub: Rx.Subscriber<any>) => {
      wx.showActionSheet({
        itemList: items,
        itemColor: color,
        success: res => sub.next(res),
        fail: e => sub.error(e),
        complete: () => sub.complete()
      })
    });
  }


  /**
   * @see [wx.hideShareMenu](https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.hideShareMenu.html)
   * @since 1.1.0
   */
  static hideShareMenu(): Rx.Observable<any>
  {
    let subject = new BehaviorSubject().filter(res => res);
    wx.hideShareMenu({
      success: res => subject.next(res),
      fail: e => subject.error(e),
      complete: () => subject.complete()
    });

    return subject;
  }

  /**
   * @param shareTicket
   * @param timeout since 1.9.90
   * @see [wx.getShareInfo](https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.getShareInfo.html)
   */
  static getShareInfo(shareTicket: string, timeout: number = 5000): Rx.Observable<any>
  {
    return Rx.Observable.create((sub: Rx.Subscriber<any>) => {
      wx.getShareInfo({
        shareTicket: shareTicket,
        timeout: timeout,
        success: res => sub.next(res),
        fail: e => sub.error(e),
        complete: () => sub.complete()
      })
    });
  }

  /**
   * 获取图片信息。网络图片需先配置download域名才能生效。
   *
   * 如果是本地图片,即'static'文件夹中的图片，
   * 如'/static/logo.png'经过wx.getImageInfo返回的path会省去开头的'/'，
   * 即'static/logo.png'，这会导致拿不到资源，
   * 所以本地图片不需要调用wx.getImageInfo()进行本地缓存
   * @param src
   */
  static getImageInfo(src: string): Observable<GetImageInfoResult>
  {
    return Rx.Observable.create(sub => {

      wx.getImageInfo({
        src: src,
        success: res => sub.next(res),
        fail: e => sub.error(e)
      })
    });
  }

  static canvasToTempFilePath(options: CanvasToTempFilePathOptions): Rx.Observable<string>
  {
    return Observable.create(sub => {
      options.success = res => sub.next(res.tempFilePath);
      options.fail = e => sub.error(e);
      options.complete = () => sub.complete();
      wx.canvasToTempFilePath(options)
    })

  }

  static parsePageScene(page: IPage): { [key: string]: string }
  {
    let sceneObj: { [key: string]: string } = {};

    try {
      let scene = decodeURIComponent(page.options.scene || "");

      scene.split('&')
          .filter(kv => /^[^=]+=[^=]+$/.test(kv))
          .forEach(kv => {
            let kvArray = kv.split("=");
            sceneObj[kvArray[0]] = kvArray[1];
          });
    } catch (e) { }

    return sceneObj
  }

  /**
   * 跳转小程序/小游戏
   * @param appId
   */
  static navWeapp(appId: string)
  {
    wx.navigateToMiniProgram({appId})
  }


  /**
   * @param selector
   * @param comp
   * @version 20190326
   * @author Zeno (zenochan@qq.com)
   */
  static queryBoundingClientRect(selector: string, comp?: IComponent): Observable<any[]>
  {
    return Observable.create(sub => {
      let query = comp ? comp.createSelectorQuery() : wx.createSelectorQuery();
      query.select(selector).boundingClientRect();
      query.exec(elements => {
        sub.next(elements)
      })
    });
  }


  /**
   * @param selector
   * @param comp
   * @version 20190326
   * @author ZenoToken (zenochan@qq.com)
   */
  static size(selector: string, comp?: IComponent): Observable<{ width: number, height: number }>
  {
    return Observable.create(sub => {
      let query = (comp || wx).createSelectorQuery();
      query.select(selector).boundingClientRect();
      query.exec(elements => {
        let el = elements[0];
        el && sub.next({width: el.right - el.left, height: el.bottom - el.top});
        sub.complete();
      })
    });
  }


  static rx<T>(handler: (options: BaseOptions) => void): Observable<T>
  {
    let options: BaseOptions = {};
    return Observable.create(sub => {
      options.complete = () => sub.complete();
      options.success = (res) => sub.next(res);
      options.fail = (err) => sub.error(err);
      handler(options);
    })
  }
}

wx.sceneName = (scene: number) => sceneMap[scene];

export const sceneMap = {
  1001: "发现栏小程序主入口",
  1005: "顶部搜索框的搜索结果页",
  1006: "发现栏小程序主入口搜索框的搜索结果页",
  1007: "单人聊天会话中的小程序消息卡片",
  1008: "群聊会话中的小程序消息卡片",
  1011: "扫描二维码",
  1012: "长按图片识别二维码",
  1013: "手机相册选取二维码",
  1014: "小程序模版消息",
  1017: "前往体验版的入口页",
  1019: "微信钱包",
  1020: "公众号 profile 页相关小程序列表",
  1022: "聊天顶部置顶小程序入口",
  1023: "安卓系统桌面图标",
  1024: "小程序 profile 页",
  1025: "扫描一维码",
  1028: "我的卡包",
  1029: "卡券详情页",
  1031: "长按图片识别一维码",
  1032: "手机相册选取一维码",
  1034: "微信支付完成页",
  1035: "公众号自定义菜单",
  1036: "App 分享消息卡片",
  1042: "添加好友搜索框的搜索结果页",
  1043: "公众号模板消息",
  1044: "群聊会话中的小程序消息卡片（带 shareTicket）",
  1047: "扫描小程序码",
  1048: "长按图片识别小程序码",
  1049: "手机相册选取小程序码",
};
