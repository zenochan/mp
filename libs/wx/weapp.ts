import {Data} from "../Data";
import {Nav} from "../nav";
import {UIKit} from "./uikit";

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
  hookInputEvent(page);

  // 是否打印周期函数日志
  ["onLoad", "onReady", "onShow", "onHide", "onUnload"].forEach(method => {
    let native = page[method];
    page[method] = function () {

      if (method == "onLoad") {
        this.navParams = Nav.navData() || {};
        if (this.navTitle) UIKit.navTitle(this.navTitle)
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

      HOOK_CONF.log && console.log(method, this.route);
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
 * @author Zeno (zenochan@qq.com)
 */
function hookInputEvent(page)
{


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
}

