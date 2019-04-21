import {UIKit} from "./uikit";
import {Nav} from "../nav";
import {HOOK_CONF, PageInjectors} from "./weapp";
import {Data} from "../Data";
import {PageData} from "../page";

/**
 * onLoad -> onShow [-> onReady] -> onHide [-> onUnload]
 */
export class BasePage implements IPage
{

  options: any = {};
  setData: (data: any) => void;

  [key: string]: any

  data: {
    page?: PageData<any>
    imgHost?: string,
    [key: string]: any
  };


  private ready = false;
  route: string;

  navParams: any;

  // @ts-ignore
  get navTitle()
  {
    return this._title;
  }

  // @ts-ignore
  set navTitle(text)
  {
    this._title = text;
    if (this.ready) UIKit.navTitle(this._title);
  }

  getData(page: number = 1)
  {
    wx.stopPullDownRefresh();
  }

  onPullDownRefresh()
  {
    if (this.data && this.data.page) this.getData()
  }

  onReachBottom()
  {
    if (this.data && this.data.page) {
      this.getData(this.data.page.current_page + 1)
    }
  }

  //<editor-fold desc="life circle">
  onLoad(options: LaunchOptions)
  {
    this.injectors('onLoad', arguments);
    this.navParams = Nav.navData() || {};
    this._title && UIKit.navTitle(this._title);
  }

  onUnload()
  {
    this.onHide();
    this.injectors('onUnload', arguments);
  }

  onShow()
  {
    this.injectors('onShow', arguments);
  }

  onHide()
  {
    this.injectors('onHide', arguments);
  }

  onReady()
  {
    this.ready = true;
    this.injectors('onReady', arguments);
  }

  //</editor-fold>

  //<editor-fold desc="input 伪双数据绑定">
  onInput(e: WXEvent)
  {
    let id = e.currentTarget.id;
    if (id) {
      let rootData = {};
      this.__setData(rootData, id, e.detail.value);
      if (e.detail.code) {
        // 选择器地区 code
        this.__setData(rootData, id + "Code", e.detail.code);
      }
      this.setData(rootData);
    }
  };


  clear(e: WXEvent)
  {
    let id = e.currentTarget.dataset.name;
    if (id) {
      let rootData = {};
      this.__setData(rootData, id, null);
      this.setData(rootData);
    }
  };

  /**
   * @param ref
   * @param id "a.b.c"
   * @param value
   * @private
   */
  private __setData(ref: Object, id: string, value: any)
  {

    let node = ref;

    let fields = id.split(".");
    if (fields.length > 1) {
      node = this.data[fields[0]] || {};
      ref[fields[0]] = node;
      // 去头去尾取节点
      for (let i = 1; i < fields.length - 1; i++) {
        node = node[fields[i]]
      }
    }
    node[fields[fields.length - 1]] = value;
  }

  private __getData(id: string)
  {

    let node = this.data;

    let fields = id.split(".");
    if (fields.length > 1) {
      node = this.data[fields[0]] || {};
      this[fields[0]] = node;
      // 去头去尾取节点
      for (let i = 1; i < fields.length - 1; i++) {
        node = node[fields[i]]
      }
    }
    return node[fields[fields.length - 1]];
  }


  onFocus(e: WXEvent)
  {
    this.setData({focus: e.currentTarget.id || null});
  };

  onBlur(e: WXEvent)
  {
    this.setData({focus: null});
  };

  onConfirm(e: WXEvent) { }

  toggle(e: WXEvent)
  {
    let id = e.currentTarget.id;
    if (id) {
      let rootData = {};
      this.__setData(rootData, id, !this.__getData(id));
      this.setData(rootData);
    }
  };
  //</editor-fold>

  //<editor-fold desc="wx open">
  /**
   * 图片预览
   * - data-url 当前url
   * - data-urls 所有图片url
   * @param e
   */
  view(e: WXEvent)
  {
    let url = e.currentTarget.dataset.url;
    let urls = e.currentTarget.dataset.urls;
    wx.previewImage({
      current: this.data.imgHost + url,
      urls: urls.map(url => this.data.imgHost + url)
    });
  };


  /**
   * 呼叫
   * @param e
   */
  call(e: WXEvent)
  {
    let mobile = e.currentTarget.dataset.mobile;
    if (mobile) { wx.makePhoneCall({phoneNumber: mobile}) }
  };

  //</editor-fold>

  //<editor-fold desc="navgator">
  /**
   * @field replace
   *
   * @since 2019-03-25
   * @version 2019-03-25
   * @author Zeno (zenochan@qq.com)
   */
  nav(url: string | WXEvent, data?: any): Promise<any>
  {
    if (typeof url == "string") {
      return Nav.navForResult(this, url, data)
    } else if (typeof url == "object") {
      let dataUrl = url.currentTarget.dataset.url;
      if (dataUrl) {
        return Nav.navForResult(this, dataUrl, url.currentTarget.dataset)
      }
    }
  };

  redirectTo(url: string, data?: any)
  {
    wx.redirectTo({url: url})
  }

  //</editor-fold>

  private injectors(method: string, args)
  {
    HOOK_CONF.log && console.log(method, this.route);

    PageInjectors.forEach(injector => {
      try {
        let injectorMethod = injector[method];
        injectorMethod && injectorMethod(this, ...args)
      } catch (ignore) { }
    });
  }


  /**
   * 分享 hook, 添加 uid
   * @param options
   * @private
   */
  private _onShareAppMessage(options: wx.ShareOptions): wx.ShareOptions
  {
    let message: wx.ShareOptions = options || {};
    //在分享链接后追加 p={userId}
    let userId = Data.getUser<any>().id;
    if (!message.path) {
      this.options.uid = userId;
      let options = Object.keys(this.options).map(key => `${key}=${this.options[key]}`).join("&");
      message.path = `${this.route}?${options}`;
    } else if (message.path.indexOf("uid=") == -1) {
      let separator = message.path.indexOf("?") == -1 ? '?' : '&';
      message.path += `${separator}uid=${userId}`
    }

    HOOK_CONF.log && console.info("onShare", message);
    return message;
  }


  static page()
  {
    // Cannot assign to read only property 'constructor'
    // https://github.com/Microsoft/TypeScript/issues/6887
    this.prototype = Object.create(this.prototype, {constructor: {value: this, writable: true}});

    let page = new this();

    let share = "onShareAppMessage";
    let origin = page[share];
    page[share] = function () {
      page["_" + share].apply(this, origin());
    };

    Page(page);
  }
}

