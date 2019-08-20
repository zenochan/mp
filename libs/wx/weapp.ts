import {Nav} from "./nav";
import {UI} from "./UI";
import {Data} from "./Data";
import {BehaviorSubject} from "../rx/Rx";

export const HOOK_CONF = {log: true};

/**
 * @field clear 清除输入框内容
 * @field onFocus
 * @field onBlur
 * @field onInput
 * @field toggle
 *
 * @field call 拨打电话 [data-mobile] 电话号码
 * @field view 预览图片 [data-url], [data-urls]
 *
 * ```
 * <div bind:tap="clear" data-input="inputId" wx:if="{{inputId}}">清除</div>
 * ```
 */
export interface PageHook
{
  onLoad?: (Ipage, options: LaunchOptions) => void;
  onReady?: (Ipage) => void;
  onShow?: (Ipage) => void;
  onHide?: (Ipage) => void;
  onUnload?: (Ipage) => void;
}

export const PageInjectors: Array<PageHook> = [];

/**
 * 在 Page 的基础上加入周期函数 hook
 * 在 PageInjectors 中添加 PageHook
 * @param page
 * @constructor
 */
export function HookPage(page: IPage = {})
{
  hookNav(page);
  hookInputEvent(page);


  page.zzLife = function () {
    if (!this.__zzLife__) {
      this.__zzLife__ = new BehaviorSubject("onInit")
    }
    return this.__zzLife__
  };

  // 是否打印周期函数日志
  ["onLoad", "onReady", "onShow", "onHide", "onUnload", "onReachBottom", "onPullDownRefresh", "onPageScroll"].forEach(method => {
    page.__zzLife__.next(method);

    let native = page[method];
    page[method] = function () {

      if (method == "onLoad") {
        this.navParams = Nav.navData() || {};
        if (this.navTitle) UI.navTitle(this.navTitle)
      }

      if (method == "onUnload") {
        // 微信 page 框架再 onUnload 周期之前不会调用 onHide，手动调用
        page.onHide.apply(this);
      }

      let args = arguments;
      if (native) {
        native.apply(this, arguments);
      }

      PageInjectors.forEach(injector => {
        try {
          let injectorMethod = injector[method];
          injectorMethod && injectorMethod(this, args)
        } catch (ignore) { }
      });

      HOOK_CONF.log && method != "onPageScroll" && console.log(method, this.route, this.navTitle);
    };
  });

  let shareMethod = "onShareAppMessage";
  if (page[shareMethod]) {
    let native = page[shareMethod];
    page[shareMethod] = function () {
      let message: wx.ShareOptions = native.apply(this, arguments);

      //在分享链接后追加 p={userId}
      let userId = Data.getUser<any>().id;
      if (!message.path) {
        this.options.p = userId;
        let options = Object.keys(this.options).map(key => `${key}=${this.options[key]}`).join("&");
        message.path = `${this.route}?${options}`;
      } else if (message.path.indexOf("p=") == -1) {
        let separator = message.path.indexOf("?") == -1 ? '?' : '&';
        message.path += `${separator}p=${userId}`
      }

      console.log("onShareMessage", message);
      return message;
    };
  }

  Page(page);
}

/**
 * @version 20190328
 * @param page
 * @author Zeno Chan (zenochan@qq.com)
 */
function hookInputEvent(page)
{
  // 伪双数据绑定
  let originInput = page.onInput;
  page['onInput'] = function (e: WXEvent) {
    let id = e.currentTarget.id;
    if (id) {
      let rootData = {};
      let node = rootData;

      let fields = id.split(".");
      if (fields.length > 1) {
        node = this.data[fields[0]] || {};
        rootData[fields[0]] = node;
        // 去头去尾取节点
        for (let i = 1; i < fields.length - 1; i++) {
          node = node[fields[i]]
        }
      }

      node[fields[fields.length - 1]] = e.detail.value;
      if (e.detail.code) {
        node[id + "Code"] = e.detail.code
      }

      this.setData(rootData);
    }
    originInput && originInput.apply(this, arguments);
  };


  let originToggle = page.toggle;
  page['toggle'] = function (e: WXEvent) {
    let id = e.currentTarget.id;
    if (id) {
      let data = {};
      data[id] = !this.data[id];
      this.setData(data);
    }
    originToggle && originToggle.apply(this, arguments);
  };

  page.clear = function (e: WXEvent) {
    let id = e.currentTarget.dataset.name;
    if (id) {
      let rootData = {};
      let node = rootData;

      let fields = id.split(".");
      if (fields.length > 1) {
        node = this.data[fields[0]] || {};
        rootData[fields[0]] = node;
        // 去头去尾取节点
        for (let i = 1; i < fields.length - 1; i++) {
          node = node[fields[i]]
        }
      }
      node[fields[fields.length - 1]] = null;
      this.setData(rootData);
    }
    originInput && originInput.apply(this, arguments);
  };

  let originFocus = page.onFocus;
  page.onFocus = function (e: WXEvent) {
    this.setData({focus: e.currentTarget.id || null});
    originFocus && originFocus.apply(this, arguments);
  };

  page.view = function (e: WXEvent) {
    let url = e.currentTarget.dataset.url;
    let urls = e.currentTarget.dataset.urls;
    wx.previewImage({
      current: url,
      urls: urls
    });
  };

  page.call = function (e: WXEvent) {
    let mobile = e.currentTarget.dataset.mobile;
    if (mobile) { wx.makePhoneCall({phoneNumber: mobile}) }
  };

  page.clearFocus = function (e: WXEvent) {
    this.setData({
      focus: null,
      hideKeyboard: true
    });
    setTimeout(() => {
      this.setData({hideKeyboard: false})
    }, 200)
  };

  let originBlur = page.onBlur;
  page.onBlur = function (e: WXEvent) {
    this.setData({focus: null});
    originBlur && originBlur.apply(this, arguments);
  };
}

/**
 * @field replace
 *
 *
 * @param page
 * @since 2019-03-25
 * @version 2019-03-25
 * @author Zeno (zenochan@qq.com)
 */
function hookNav(page: IPage)
{
  page.nav = function (url: string | WXEvent, data?: any) {
    if (typeof url == "string") {
      Nav.navForResult(this, url, data)
    } else if (typeof url == "object") {
      let dataUrl = url.currentTarget.dataset.url;
      dataUrl && Nav.navForResult(this, dataUrl, url.currentTarget.dataset)
    }
  };

  page.replace = function (url: string) {
    wx.redirectTo({url: url})
  }
}
