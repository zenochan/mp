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

