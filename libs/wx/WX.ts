import { BehaviorSubject, Observable, Subscriber } from '../rx/Rx';
import { UI } from './UI';
import { rxEmpty, rxJust } from '../rx/RxExt';
import { Events } from './Events';
import Scope = wx.Scope;
import RequestPaymentOptions = wx.RequestPaymentOptions;
import CanvasToTempFilePathOptions = wx.CanvasToTempFilePathOptions;
import ScanCodeResult = wx.ScanCodeResult;

/**
 * 微信 API rx 封装
 *
 * # 开放接口
 */
export class WX {
  static saveImageToPhotosAlbum(src, denied: () => void) {
    WX.authorize('scope.writePhotosAlbum')
      .flatMap(() => WX.getImageInfo(src))
      .subscribe((res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          success: () => UI.toastSuccess('图片已保存'),
        });
      }, (e) => {
        if ((e.errMsg || '').indexOf('authorize:fail') != -1) {
          denied();
        } else {
          UI.toastFail(e);
        }
      });
  }

  /**
   * @see Scope
   */
  static SCOPE = {
    USER_INFO: 'scope.userInfo',
    USER_LOCATION: 'scope.userLocation',
    ADDRESS: 'scope.address',
    INVOICE_TITLE: 'scope.invoiceTitle',
    WE_RUN: 'scope.werun',
    RECORD: 'scope.record',
    WRITE_PHOTOS_ALBUM: 'scope.writePhotosAlbum',
    CAMERA: 'scope.camera',
  };

  static page(): IPage {
    const pages = getCurrentPages();
    return pages[pages.length - 1];
  }

  static pagePre(): Observable<IPage> {
    const pages = getCurrentPages();
    if (pages.length > 1) {
      return rxJust(pages[pages.length - 2]);
    }
    rxEmpty();
  }

  static pagePrePath(): string {
    const pages = getCurrentPages();
    if (pages.length < 2) {
      return '';
    }
    return pages[pages.length - 2].route;
  }

  /**
   * 小程序强制更新
   * @param delayMs 延时弹框，安卓上有时候不显示
   */
  static forceUpdate(delayMs: number = 100) {
    if (delayMs < 0) {
      delayMs = 0;
    }

    wx.getUpdateManager().onUpdateReady(() => {
      setTimeout(() => {
        UI.alert('需要重启小程序完成更新').subscribe((res) => wx.getUpdateManager().applyUpdate());
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
  static isIphoneX(): Observable<boolean> {
    return Observable.create((sub) => wx.getSystemInfo({
      success: (res) => {
        sub.next(res.model.indexOf('iPhone X') != -1);
      },
      fail: (e) => sub.error(e),
    }));
  }

  static systemInfo(): Observable<wx.GetSystemInfoResult> {
    return Observable.create((sub) => wx.getSystemInfo({
      success: (res) => {
        const menuRounding = wx.getMenuButtonBoundingClientRect();
        res.navigationHeight = (menuRounding.top - res.statusBarHeight) * 2 + menuRounding.height;
        if (!res.safeArea) {
          res.safeArea = {
            paddingBottom: 0, left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0,
          };
        }
        res.safeArea.paddingBottom = res.screenHeight - res.safeArea.bottom;
        sub.next(res);
      },
      fail: (e) => sub.error(e),
    }));
  }

  static systemInfoSync(): wx.GetSystemInfoResult {
    const res = wx.getSystemInfoSync();

    const menuRounding = wx.getMenuButtonBoundingClientRect();
    res.navigationHeight = (menuRounding.top - res.statusBarHeight) * 2 + menuRounding.height;

    if (!res.safeArea) {
      res.safeArea = {
        paddingBottom: 0, left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0,
      };
    }
    res.safeArea.paddingBottom = res.screenHeight - res.safeArea.bottom;
    return res;
  }

  /**
   * @deprecated use {@link systemInfo}
   */
  static navHeight(): Observable<number> {
    return WX.systemInfo().map((res) => {
      const menuRounding = wx.getMenuButtonBoundingClientRect();
      return (menuRounding.top - res.statusBarHeight) * 2 + menuRounding.height;
    });
  }

  static EVENT_LOCATION_DENY = 'deny:location';

  static getLocation(options?: { isHighAccuracy: boolean }): Observable<wx.GetLocationResult> {
    const { isHighAccuracy } = options || {};

    return Observable.create((sub) => wx.getLocation({
      type: 'gcj02',
      isHighAccuracy,
      // altitude: true,
      success: (res) => sub.next(res),
      fail: (e) => {
        if (e.errMsg.indexOf('auth') > 0) {
          console.error('用户已拒绝定位授权');
          Events.publish(this.EVENT_LOCATION_DENY, true);
        } else {
          sub.error('获取定位失败，请检查微信是否有定位权限');
        }
      },
      complete: () => sub.complete(),
    }));
  }

  /**
   * 是否是 iPhone
   *
   * @see <a href="https://blog.csdn.net/weixin_39449961/article/details/80252895">微信小程序中的iPhone X适配问题</a>
   * @version 20190327
   * @author Zeno (zenochan@qq.com)
   */
  static isIphone(): Observable<boolean> {
    return Observable.create((sub) => wx.getSystemInfo({
      success: (res) => {
        sub.next(res.model.indexOf('iPhone') != -1);
      },
      fail: (e) => sub.error(e),
    }));
  }

  static onPageScroll(handler: (scrollTop) => void) {
    const pages = getCurrentPages();
    const page = pages[pages.length - 1];
    const origin = page.onPageScroll;
    page.onPageScroll = function (event) {
      origin && origin(event);
      handler(event.scrollTop);
    };
  }

  /**
   *  - The payload is invalid: 一定要在使用session_key 前调用wx.login, 否则解密消息时会此错误
   *
   * @param timeout {@link LoginOptions.timeout}
   * @see wx.login
   * @return code string
   */
  static login(timeout?: number): Observable<string> {
    return Observable.create((emitter) => {
      wx.login({
        timeout,
        success: (res) => emitter.next(res),
        fail: (error) => emitter.error(error),
        complete: () => emitter.complete(),
      });
    }).map((res) => res.code);
  }

  static checkSession(): Observable<boolean> {
    return Observable.create((emitter) => {
      wx.checkSession({
        // session_key 未过期，并且在本生命周期一直有效
        success: () => emitter.next(true),
        // session_key 已经失效，需要重新执行登录流程
        fail: () => emitter.next(false),
        complete: () => emitter.complete(),
      });
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
  static scanCode(scanType: string[] = ['qrCode'], onlyFromCamera: boolean = true): Observable<ScanCodeResult> {
    return Observable.create((emitter) => {
      wx.scanCode({
        scanType,
        onlyFromCamera,
        success: (res) => emitter.next(res),
        fail: (err) => emitter.error(err),
        complete: () => emitter.complete(),
      });
    });
  }

  /**
   * @since v1.2.0
   * @see wx.getSetting
   */
  static getSetting(): Observable<Scope> {
    return Observable.create((emitter) => {
      wx.getSetting({
        success: (res) => emitter.next(res),
        fail: (error) => emitter.error(error),
        complete: () => emitter.complete(),
      });
    }).map((res) => {
      const { authSetting } = res;
      return {
        userInfo: authSetting[WX.SCOPE.USER_INFO] || false,
        userLocation: authSetting[WX.SCOPE.USER_LOCATION] || false,
        address: authSetting[WX.SCOPE.ADDRESS] || false,
        invoiceTitle: authSetting[WX.SCOPE.INVOICE_TITLE] || false,
        werun: authSetting[WX.SCOPE.WE_RUN] || false,
        record: authSetting[WX.SCOPE.RECORD] || false,
        writePhotosAlbum: authSetting[WX.SCOPE.WRITE_PHOTOS_ALBUM] || false,
        camera: authSetting[WX.SCOPE.CAMERA] || false,
      };
    });
  }

  static getUserInfo(lang: 'en' | 'zh_CN' | 'zh_TW' = 'zh_CN'): Observable<wx.UserInfo> {
    return Observable.create((emitter) => {
      wx.getUserInfo({
        lang,
        success: (res) => emitter.next(res),
        fail: (error) => emitter.error(error),
        complete: () => emitter.complete(),
      });
    });
  }

  /**
   * https://developers.weixin.qq.com/miniprogram/dev/api/open-api/authorize/wx.authorize.html
   */
  static authorize(scope: string): Observable<any> {
    return Observable.create((emitter) => {
      wx.authorize({
        scope,
        success: (res) => emitter.next(res),
        fail: (error) => emitter.error(error),
        complete: () => emitter.complete(),
      });
    });
  }

  static requestPayment(sign: RequestPaymentOptions): Observable<any> | any {
    return Observable.create((emitter) => {
      sign.success = () => emitter.next();
      sign.complete = () => emitter.complete();
      sign.fail = (e) => emitter.error(e.errMsg);
      wx.requestPayment(sign);
    });
  }

  static chooseImage(count: number = 1, sourceType: string[] = ['camera', 'album']): Observable<string[]> {
    return Observable.create((sub) => {
      wx.chooseImage({
        count,
        sourceType,
        success: (res) => sub.next(res.tempFilePaths),
        fail: (e) => {
          // 忽略取消错误
          if (e.errMsg.indexOf('cancel') === -1) {
            sub.error(e);
          }
        },
        complete: () => sub.complete(),
      });
    });
  }

  static chooseVideo(count: number = 1, sourceType: string[] = ['camera', 'album']): Observable<wx.ChooseVideoRes> {
    return Observable.create((sub) => {
      wx.chooseVideo({
        sourceType,
        success: (res) => sub.next(res),
        fail: (e) => {
          // 忽略取消错误
          if (e.errMsg.indexOf('cancel') == -1) {
            sub.error(e);
          }
        },
        complete: () => sub.complete(),
      });
    });
  }

  static chooseMedia(options: {
    count?: number,
    sourceType?: ('camera' | 'album')[],
    mediaType?: ('image' | 'video')[]
  }): Observable<any[]> {
    const {
      count = 1,
      sourceType = ['camera', 'album'],
      mediaType = ['image', 'video'],
    } = options;

    return Observable.create((sub) => {
      const chooseOptions = {
        count,
        mediaType,
        sourceType,
        success: (res: {
          tempFiles?: {
            path: string,                 // image
            tempFilePath: string,         // media
            size: number,                 // image,media
            duration: number,             // media.video
            height: number,               // media.video
            width: number,                // media.video
            thumbTempFilePath?: string    // media.video
          }[],
        } | any) => {
          const files = res.tempFiles || [{
            ...res,
            fileType: 'video',
          }];
          files.forEach((file) => {
            if (file.path) {
              file.tempFilePath = file.path;
              delete file.path;
            }
            if (!Object.prototype.hasOwnProperty.call(file, 'fileType')) {
              file.fileType = 'image';
            }
          });
          sub.next(files);
        },
        fail: (e) => {
          // 忽略取消错误
          if (e.errMsg.indexOf('cancel') === -1) {
            sub.error(e);
          }
        },
        complete: () => sub.complete(),
      };

      if (wx.chooseMedia) {     // 2.10.0
        wx.chooseMedia(chooseOptions);
      } else if (mediaType.length === 2) {
        UI.showActionSheet(['拍图片', '拍视频', '从相册选择图片', '从相册选择视频']).subscribe((index) => {
          switch (index) {
            case 0:
              wx.chooseImage({ ...chooseOptions, sourceType: ['camera'] });
              break;
            case 1:
              wx.chooseVideo({ ...chooseOptions, sourceType: ['camera'] });
              break;
            case 2:
              wx.chooseImage({ ...chooseOptions, sourceType: ['album'] });
              break;
            default:
              wx.chooseVideo({ ...chooseOptions, sourceType: ['album'] });
              break;
          }
        });
      } else if (mediaType[0] === 'video') {
        wx.chooseVideo(chooseOptions);
      } else {
        wx.chooseImage(chooseOptions);
      }
    });
  }

  /**
   * @see [wx.updateShareMenu](https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.updateShareMenu.html)
   */
  static updateShareMenu(withShareTicket: boolean): Observable<any> {
    return Observable.create((sub: Subscriber<any>) => {
      wx.updateShareMenu({
        withShareTicket,
        success: (res) => sub.next(res),
        fail: (e) => sub.error(e),
        complete: () => sub.complete(),
      });
    });
  }

  /**
   * @see [wx.showShareMenu](https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.showShareMenu.html)
   * @since 1.1.0
   */
  static showShareMenu(withShareTicket: boolean = false): Observable<any> {
    const sub = new BehaviorSubject().filter((res) => res);

    wx.showShareMenu({
      withShareTicket,
      success: (res) => sub.next(res),
      fail: (e) => sub.error(e),
      complete: () => sub.complete(),
    });
    return sub;
  }

  static showActionSheet(items: string[], color: string = '#000000'): Observable<any> {
    return Observable.create((sub: Subscriber<any>) => {
      wx.showActionSheet({
        itemList: items,
        itemColor: color,
        success: (res) => sub.next(res),
        fail: (e) => sub.error(e),
        complete: () => sub.complete(),
      });
    });
  }

  /**
   * @see [wx.hideShareMenu](https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.hideShareMenu.html)
   * @since 1.1.0
   */
  static hideShareMenu(): Observable<any> {
    const subject = new BehaviorSubject().filter((res) => res);
    wx.hideShareMenu({
      success: (res) => subject.next(res),
      fail: (e) => subject.error(e),
      complete: () => subject.complete(),
    });

    return subject;
  }

  /**
   * @param shareTicket
   * @param timeout since 1.9.90
   * @see [wx.getShareInfo](https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.getShareInfo.html)
   */
  static getShareInfo(shareTicket: string, timeout: number = 5000): Observable<any> {
    return Observable.create((sub: Subscriber<any>) => {
      wx.getShareInfo({
        shareTicket,
        timeout,
        success: (res) => sub.next(res),
        fail: (e) => sub.error(e),
        complete: () => sub.complete(),
      });
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
  static getImageInfo(src: string): Observable<wx.GetImageInfoResult> {
    return Observable.create((sub) => {
      wx.getImageInfo({
        src,
        success: (res) => sub.next(res),
        fail: (e) => sub.error(e),
      });
    });
  }

  static canvasToTempFilePath(options: CanvasToTempFilePathOptions): Observable<string> {
    return Observable.create((sub) => {
      options.success = (res) => sub.next(res.tempFilePath);
      options.fail = (e) => sub.error(e);
      options.complete = () => sub.complete();
      wx.canvasToTempFilePath(options);
    });
  }

  static parsePageScene(page: IPage): { [key: string]: string } {
    const sceneObj: { [key: string]: string } = {};

    try {
      const scene = decodeURIComponent(page.options.scene || '');

      sceneObj.origin = scene;
      if (scene.includes('=')) {
        scene.split('&')
          .filter((kv) => /^[^=]+=[^=]+$/.test(kv))
          .forEach((kv) => {
            const kvArray = kv.split('=');
            sceneObj[kvArray[0]] = kvArray[1];
          });
      }
    } catch (e) {
    }

    return sceneObj;
  }

  /**
   * 跳转小程序/小游戏
   * @param appId
   */
  static navWeapp(appId: string) {
    wx.navigateToMiniProgram({ appId });
  }

  /**
   * @param selector
   * @param comp
   * @version 20190326
   * @author Zeno (zenochan@qq.com)
   */
  static queryBoundingClientRect(selector: string, comp?: IComponent): Observable<any[]> {
    return Observable.create((sub) => {
      const query = comp ? comp.createSelectorQuery() : wx.createSelectorQuery();
      query.selectAll(selector).boundingClientRect();
      query.exec((elements) => {
        sub.next(elements[0]);
      });
    });
  }

  /**
   * @param selector
   * @param comp
   * @version 20190326
   * @author ZenoToken (zenochan@qq.com)
   */
  static size(selector: string, comp?: IComponent): Observable<{ width: number, height: number }> {
    return Observable.create((sub) => {
      const query = (comp || wx).createSelectorQuery();
      query.select(selector).boundingClientRect();
      query.exec((elements) => {
        const el = elements[0];
        el && sub.next({ width: el.right - el.left, height: el.bottom - el.top });
        sub.complete();
      });
    });
  }

  static clipboard(data: string): Observable<any> {
    return this.rx((handler) => {
      handler.data = data;
      wx.setClipboardData(handler);
    });
  }

  static rx<T>(handler: (options: BaseOptions) => void): Observable<T> {
    const options: BaseOptions = {};
    return Observable.create((sub) => {
      options.complete = () => sub.complete();
      options.success = (res) => sub.next(res);
      options.fail = (err) => sub.error(err);
      handler(options);
    });
  }
}

wx.sceneName = (scene: number) => sceneMap[scene];

export const sceneMap = {
  1001: '发现栏小程序主入口',
  1005: '顶部搜索框的搜索结果页',
  1006: '发现栏小程序主入口搜索框的搜索结果页',
  1007: '单人聊天会话中的小程序消息卡片',
  1008: '群聊会话中的小程序消息卡片',
  1011: '扫描二维码',
  1012: '长按图片识别二维码',
  1013: '手机相册选取二维码',
  1014: '小程序模版消息',
  1017: '前往体验版的入口页',
  1019: '微信钱包',
  1020: '公众号 profile 页相关小程序列表',
  1022: '聊天顶部置顶小程序入口',
  1023: '安卓系统桌面图标',
  1024: '小程序 profile 页',
  1025: '扫描一维码',
  1028: '我的卡包',
  1029: '卡券详情页',
  1031: '长按图片识别一维码',
  1032: '手机相册选取一维码',
  1034: '微信支付完成页',
  1035: '公众号自定义菜单',
  1036: 'App 分享消息卡片',
  1042: '添加好友搜索框的搜索结果页',
  1043: '公众号模板消息',
  1044: '群聊会话中的小程序消息卡片（带 shareTicket）',
  1047: '扫描小程序码',
  1048: '长按图片识别小程序码',
  1049: '手机相册选取小程序码',
};
