import { Nav } from './nav';
import { UI } from './UI';
import { Data } from './Data';
import { BehaviorSubject } from '../rx/Rx';
import { API, WX } from '../mp';

export const HOOK_CONF = {
  log: true,
  shareUserIdKey: 'p',
};

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
export interface PageHook {
  init?: (Ipage) => void;
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
export function HookPage(page: IPage = {}) {
  hookNav(page);
  hookInputEvent(page);

  PageInjectors.forEach((item) => {
    if (item.init) {
      item.init(page);
    }
  });

  page.zzLife = function () {
    if (!this.__zzLife__) {
      this.__zzLife__ = new BehaviorSubject('onInit');
    }
    return this.__zzLife__;
  };

  page.onDataChange = new BehaviorSubject('');
  page.zzSetData = function () {
    this.setData.apply(this, arguments);
    page.onDataChange.next(arguments);
  };

  // 是否打印周期函数日志
  [
    'onLoad', 'onReady', 'onShow', 'onHide', 'onUnload',
    'onReachBottom', 'onPullDownRefresh', 'onPageScroll',
  ].forEach((method) => {
    const native = page[method];
    page[method] = function () {
      page.zzLife.apply(this).next(method);

      if (method === 'onLoad') {
        this.options.scene = WX.parsePageScene(this);
        this.setData({ options: this.options });

        this.navParams = Nav.navData() || {};
        Object.keys(this.options).forEach((key) => {
          if (!this.navParams.hasOwnProperty(key)) {
            this.navParams[key] = decodeURIComponent(this.options[key]);
          }
        });

        this.route = `/${this.route}`;

        if (this.navTitle) UI.navTitle(this.navTitle);
      }

      if (method === 'onUnload') {
        // 微信 page 框架再 onUnload 周期之前不会调用 onHide，手动调用
        page.onHide.apply(this);
      }

      const args = arguments;
      if (native) {
        native.apply(this, arguments);
      }

      PageInjectors.forEach((injector) => {
        try {
          const injectorMethod = injector[method];
          injectorMethod && injectorMethod(this, args);
        } catch (ignore) {
          // ignore
        }
      });

      if (HOOK_CONF.log && method !== 'onPageScroll') {
        console.log(method, this.route, this.navTitle);
      }
    };
  });

  const shareMethod = 'onShareAppMessage';
  if (page[shareMethod]) {
    const native = page[shareMethod];
    page[shareMethod] = function () {
      const message: wx.ShareOptions = native.apply(this, arguments);

      // 在分享链接后追加 p={userId}
      const userId = Data.getUser<any>().id;
      if (!message.path) {
        this.options[HOOK_CONF.shareUserIdKey] = userId;
        const options = Object.keys(this.options).map((key) => `${key}=${this.options[key]}`).join('&');
        message.path = `${this.route}?${options}`;
      } else if (message.path.indexOf(`${HOOK_CONF.shareUserIdKey}=`) === -1) {
        const separator = message.path.indexOf('?') === -1 ? '?' : '&';
        message.path += `${separator}${HOOK_CONF.shareUserIdKey}=${userId}`;
      }

      console.log('onShareMessage', message);
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
function hookInputEvent(page) {
  // 伪双数据绑定
  const originInput = page.onInput;
  page.onInput = function (e: WXEvent) {
    const { id } = e.currentTarget;
    if (id) {
      const rootData = {};
      let node = rootData;

      const fields = id.split('.');
      if (fields.length > 1) {
        node = this.data[fields[0]] || {};
        rootData[fields[0]] = node;
        // 去头去尾取节点
        for (let i = 1; i < fields.length - 1; i++) {
          node = node[fields[i]];
        }
      }

      // vant field 组件detail即value, value 为空时  {value:'' , cursor:0,keyCode:8}
      let value = e.detail;
      if (Object.prototype.hasOwnProperty.call(value, 'value')) {
        value = e.detail.value;
      }
      node[fields[fields.length - 1]] = value;

      if (e.detail.code) {
        node[`${id}Code`] = e.detail.code;
      }

      this.setData(rootData);
    }
    if (typeof originInput === 'function') {
      originInput.apply(this, arguments);
    }
  };

  const originToggle = page.toggle;
  page.toggle = function (e: WXEvent) {
    const { id } = e.currentTarget;
    if (id) {
      const data = {};
      data[id] = !this.data[id];
      this.setData(data);
    }
    if (typeof originToggle === 'function') {
      originToggle.apply(this, arguments);
    }
  };

  page.clear = function (e: WXEvent) {
    const id = e.currentTarget.dataset.name;
    if (id) {
      const rootData = {};
      let node = rootData;

      const fields = id.split('.');
      if (fields.length > 1) {
        node = this.data[fields[0]] || {};
        rootData[fields[0]] = node;
        // 去头去尾取节点
        for (let i = 1; i < fields.length - 1; i++) {
          node = node[fields[i]];
        }
      }
      node[fields[fields.length - 1]] = null;
      this.setData(rootData);
    }

    if (typeof originInput === 'function') {
      originInput.apply(this, arguments);
    }
  };

  const originFocus = page.onFocus;
  page.onFocus = function (e: WXEvent) {
    this.setData({
      focus: e.currentTarget.id || null,
      keyboardHeight: e.detail.height,
    });
    if (typeof originFocus === 'function') {
      originFocus.apply(this, arguments);
    }
  };

  page.view = function (e: WXEvent) {
    let options = {
      current: e.currentTarget.dataset.url,
      urls: e.currentTarget.dataset.urls,
    };
    options = API.completeImgUrl(options);
    wx.previewImage(options);
  };

  page.call = function (e: WXEvent) {
    const { mobile } = e.currentTarget.dataset;
    if (mobile) {
      wx.makePhoneCall({ phoneNumber: mobile });
    }
  };

  page.clearFocus = function () {
    this.setData({
      focus: null,
      hideKeyboard: true,
    });
    setTimeout(() => {
      this.setData({ hideKeyboard: false });
    }, 200);
  };

  // let originBlur = page.onBlur;
  // page.onBlur = function (e: WXEvent) {
  //   this.setData({focus: null});
  //   originBlur && originBlur.apply(this, arguments);
  // };

  const originBlur = page.onBlur;
  page.onBlur = function () {
    this.setData({ focus: null, keyboardHeight: 0 });
    if (typeof originBlur === 'function') {
      originBlur.apply(this, arguments);
    }
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
function hookNav(page: IPage) {
  page.nav = function (url: string | WXEvent, data?: any) {
    if (typeof url === 'object') {
      data = url.currentTarget.dataset;
      url = url.currentTarget.dataset.url;
    }

    if (!url) return;

    url = url.toString();

    if (url.indexOf('tab:') === 0) {
      Nav.switchTab(url.replace('tab:', ''));
    } else if (url) {
      Nav.navForResult(this, url, data);
    }
  };

  page.replace = function (url: string) {
    wx.redirectTo({ url });
  };
}

PageInjectors.push({
  onShow(page) {
    if (page.showed) {
      if (page.autoRefresh || page.onceRefresh) {
        page.onPullDownRefresh(); // 满足条件，刷新数据
        page.onceRefresh = false; // 重置刷新条件
      }
    } else {
      page.showed = true;
    }
    wx.hideNavigationBarLoading();
  },
});

// 注入 showModal, hideModal
PageInjectors.push({
  onLoad(page: IPage) {
    page.showModal = (event: WXEvent | string) => {
      const target = typeof event === 'string' ? event : event.currentTarget.dataset.modal;
      const { modal = {} } = page.data;
      modal[target] = true;
      page.setData({ modal });

      modal[target] = false;
    };

    page.hideModal = (event: WXEvent | string) => {
      const target = typeof event === 'string' ? event : event.currentTarget.dataset.modal;
      const { modal = {} } = page.data;
      modal[target] = false;
      page.setData({ modal: page.data.modal });
    };
  },
});
