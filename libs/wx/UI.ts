import Rx = require("../rx/Rx");

export class UI
{
  static colorPrimary = "#9A52D3";

  //<editor-fold desc="交互反馈">
  static showLoading(msgOrOptions: String | LoadingOptions = "加载中")
  {
    let options: any;
    if (typeof msgOrOptions == 'object') {
      options = msgOrOptions;
    } else {
      options = {
        title: msgOrOptions
      };
    }
    options.mask = true;
    wx.showLoading(options)
  }


  static hideLoading()
  {
    wx.hideLoading()
  }


  static loading(show: boolean | string = false)
  {
    if (show) {
      wx.showLoading({title: typeof show === "string" ? show : "加载中..."})
    } else {
      wx.hideLoading()
    }
  }

  static showToast(msgOrOptions: String | Number | ToastOptions)
  {
    let options: ToastOptions = typeof msgOrOptions !== "object"
        ? {title: msgOrOptions + ""}
        : msgOrOptions as ToastOptions;

    wx.showToast(options)
  }

  static hideToast()
  {
    wx.hideToast()
  }

  /** 不能通过点击遮罩消失 */
  static showModal(options: ModalOptions): Rx.Observable<boolean>
  {
    if (typeof options.content == "object") options.content = JSON.stringify(options.content);

    if (!options.confirmColor) options.confirmColor = UI.colorPrimary;

    let behavor = new Rx.BehaviorSubject("ignore").filter(res => res == true);

    options.success = res => {
      if (res.confirm) behavor.next(true);
      if (res.cancel) behavor.next(false);
      behavor.complete();
    };

    options.fail = res => {
      console.error(res);
      behavor.error(res.errMsg)
    };
    wx.showModal(options);

    return Rx.Observable.create(sub => {
      behavor.subscribe(sub)
    });
  }

  /** 不能通过点击遮罩消失 */
  static showModalWithCancel(options: ModalOptions): Rx.Observable<boolean>
  {
    if (typeof options.content == "object") options.content = JSON.stringify(options.content);

    if (!options.confirmColor) options.confirmColor = UI.colorPrimary;

    let sub = new Rx.BehaviorSubject("ignore").filter(res => res != "ignore");

    options.success = res => {
      if (res.confirm) sub.next(true);
      if (res.cancel) sub.next(false);
      sub.complete();
    };

    options.fail = res => sub.error(res.errMsg);
    wx.showModal(options);

    return sub;
  }


  /** 不能通过点击遮罩消失 */
  static alert(content: string, confirm: string = "确定", title: string = "提示"): Rx.Observable<any>
  {
    UI.loading();
    if (typeof content == "object") content = JSON.stringify(content);
    let sub = new Rx.BehaviorSubject("ignore").filter(res => res == true);

    UI.showModal({
      title: title,
      content: content,
      showCancel: false,
      confirmText: confirm,
      confirmColor: UI.colorPrimary,
      complete: () => {
        sub.next(true);
        sub.complete();
      }
    });

    return sub;
  }


  /** 不能通过点击遮罩消失 */
  static confirm(content: string, confirm: string = '确定', title: string = "提示"): Rx.Observable<boolean>
  {
    if (typeof content == "object") content = JSON.stringify(content);

    return UI.showModal({
      title: title,
      content: content,
      confirmText: confirm,
      confirmColor: UI.colorPrimary
    })
  }

  /**
   * @param {Array<String>} items 按钮的文字数组，<font color=red>数组长度最大为 6 个</font>
   * @returns {Observable<number>} tapIndex
   */
  static showActionSheet(items: Array<string>): Rx.Observable<number>
  {
    return Rx.Observable.create((sub: Rx.Subscriber<number>) => {
      wx.showActionSheet({
        itemList: items,
        success: res => {
          sub.next(res.tapIndex);
          sub.complete()
        },
        fail: res => sub.error(res.errMsg)
      })
    })
  }

  //</editor-fold>
  /**
   * @param {"#ffffff" | "#000000"} frontColor 导航栏前景色，包括标题，按钮, 状态栏
   * @param {String} bgColor 导航栏背景色
   */
  static navColor(frontColor: "#ffffff" | "#000000", bgColor: String)
  {
    wx.setNavigationBarColor({frontColor: frontColor, backgroundColor: bgColor})
  }


  /**
   * 设置导航栏标题
   * @param title
   */
  static navTitle(title: string)
  {
    wx.setNavigationBarTitle({title: title})
  }


  static navLoading(loading: Boolean = true)
  {
    if (loading) {
      wx.showNavigationBarLoading()
    } else {
      wx.hideNavigationBarLoading()
    }
  }

  static navLoadingHandler(page: IPage, count: number)
  {
    let key = "netCount";
    if (!page[key]) page[key] = 0;
    page[key] += count;
    if (page[key] < 0) page[key] = 0;
    this.navLoading(page[key] > 0)
  }

  static toastSuccess(msg: string, complete = () => {})
  {
    if (typeof msg != "string") msg = JSON.stringify(msg);

    wx.showToast({
      title: msg,
      icon: 'success',
      duration: 1000,
      complete: () => complete()
    })
  }

  static toastFail(msg: string, duration: number = 1000)
  {
    if (typeof msg != "string") msg = JSON.stringify(msg);

    wx.showToast({
      title: msg,
      icon: 'none',
      duration: duration
    })
  }

}

export declare namespace wx
{
  //<editor-fold desc="交互反馈">
  /**
   * @since 1.1.0
   * @param {LoadingOptions} options
   */
  export function showLoading(options: LoadingOptions)

  export function hideLoading()

  export function showToast(options: ToastOptions)

  export function hideToast()

  export function showModal(options: ModalOptions)

  export function showActionSheet(options: ActionSheetOptions)

  //</editor-fold>

  //<editor-fold desc="导航栏">
  export function setNavigationBarTitle(options: { title: String })

  /**
   * @since 1.4.0
   */
  export function setNavigationBarColor(options: NavOptions)

  export function showNavigationBarLoading()

  export function hideNavigationBarLoading()

  //</editor-fold>

}

export interface LoadingOptions
{
  title: String                   // 提示的内容
  mask?: Boolean                  // 是否显示透明蒙层，防止触摸穿透 ,默认：false
  success?: Function              // 接口调用成功的回调函数
  fail?: Function                 // 接口调用失败的回调函数
  complete?: Function             // 接口调用结束的回调函数（调用成功、失败都会执行）
}

export interface ToastOptions
{
  title: String                   // 提示的内容
  icon?: "success" | "loading" | "none"
  image?: String                  // 自定义图标的本地路径，image 的优先级高于 icon  since:1.1.0
  duration?: Number               // 提示的延迟时间，单位毫秒，默认：1500
  mask?: Boolean                  // 是否显示透明蒙层，防止触摸穿透，默认：false
  success?: Function	            // 接口调用成功的回调函数
  fail?: Function	                // 接口调用失败的回调函数
  complete?: Function	            // 接口调用结束的回调函数（调用成功、失败都会执行）
}

export interface ModalOptions
{
  title: String	                  // 提示的标题
  content: String	                // 提示的内容
  showCancel?: Boolean	          // 是否显示取消按钮，默认为 true
  cancelText?: String	            // 取消按钮的文字，默认为"取消"，最多 4 个字符
  cancelColor?: String	          // 取消按钮的文字颜色，默认为"#000000"
  confirmText?: String	          // 确定按钮的文字，默认为"确定"，最多 4 个字符
  confirmColor?: String	          // 确定按钮的文字颜色，默认为"#3CC51F"
  success?: Function	            // 接口调用成功的回调函数
  fail?: Function	                // 接口调用失败的回调函数
  complete?: Function	            // 接口调用结束的回调函数（调用成功、失败都会执行）
}

export interface ActionSheetOptions
{
  itemList: Array<string>	        // 按钮的文字数组，数组长度最大为6个
  itemColor?: string	            // 按钮的文字颜色，默认为"#000000"
  success?: Function	            // 接口调用成功的回调函数，详见返回参数说明
  fail?: Function	                // 接口调用失败的回调函数
  complete?: Function	            // 接口调用结束的回调函数（调用成功、失败都会执行）
}


export interface NavAnimation
{
  duration?: Number	              // 动画变化时间，默认0，单位：毫秒
  timingFunc?: String	            // 动画变化方式，默认 linear
}

export interface NavOptions
{
  frontColor: "#ffffff" | "#000000"   //是	前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000
  backgroundColor: String	            //是	背景颜色值，有效值为十六进制颜色
  animation?: NavAnimation	          //否	动画效果
  success?: Function	                //否	接口调用成功的回调函数
  fail?: Function	                    //否	接口调用失败的回调函数
  complete?: Function	                //否	接口调用结束的回调函数（调用成功、失败都会执行）
}

