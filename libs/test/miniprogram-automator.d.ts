/*
 * Copyright (c) 2020. ZenoChan
 */


interface MiniProgramAutomator {
  connect(options: {
    wsEndpoint: string    // 开发者工具 WebSocket 地址
  }): Promise<MiniProgram>;

  launch(options: {
    cliPath?: string	          //否	-	开发者工具命令行工具绝对路径
    projectPath: string	        //是	-	项目绝对路径
    timeout?: number	          //否	30000	启动最长等待时间
    port?: number	              //否	-	WebSocket 端口号
    account?: string	          //否	-	用户 openid
    projectConfig?: any	        //否	-	覆盖 project.config.json 中的配置
  }): Promise<MiniProgram>;
}

interface MiniProgram {
  // 断开与小程序运行时的连接
  disconnect(): void;
  reLaunch(url:string): Promise<MiniPage>

  pageStack(): Promise<MiniPage>

  navigateTo(url: string): Promise<MiniPage>

  redirectTo(url: string): Promise<MiniPage>

  navigateBack(url: string): Promise<MiniPage>

  switchTab(url: string): Promise<MiniPage>

  currentPage(): Promise<MiniPage>

  systemInfo(): Promise<any>

  /**
   * 调用 wx 对象上的指定方法。
   */
  callWxMethod(): Promise<any>

  /**
   * 覆盖 wx 对象上指定方法的调用结果。
   * 利用该接口，你可以很方便地直接指定 wx.chooseLocation 等调用系统组件的返回结果。
   */
  mockWxMethod(method: string, result: any): Promise<void>

  mockWxMethod(method: string, fn: Function | string, ...args: any[]): Promise<void>

  /**
   * 重置 wx 指定方法，消除 mockWxMethod 调用的影响。
   */
  restoreWxMethod(method: string): Promise<void>

  /**
   * 往 AppService 注入代码片段并返回执行结果。
   * @param appFunction  代码片段
   * @param args 执行时传入参数
   */
  evaluate(appFunction: Function | string, ...args: any[]): Promise<any>

  /**
   * 对当前页面截图，目前只有开发者工具模拟器支持，客户端无法使用。
   * @param options 如果不传 options，该方法返回图片数据的 base64 编码。
   */
  screenshot(options?: {
    path: string// 图片保存路劲
  }): Promise<string | void>

}

interface MiniPage {
  path: string
  query: Object

  $(selector: string): Promise<MiniElement>

  $$(selector: string): Promise<MiniElement[]>

  /**
   *
   * @param condition
   *
   * - 如果条件是 string 类型，那么该参数会被当成选择器，当该选择器选中元素个数不为零时，结束等待。
   * - 如果条件是 number 类型，那么该参数会被当成超时时长，当经过指定时间后，结束等待。
   * - 如果条件是 Function 类型，那么该参数会被当成断言函数，当该函数返回真值时，结束等待。
   */
  waitFor(condition: string | number | Function): Promise<void>

  data(path: string): Promise<any>

  setData(data: Object): Promise<void>

  /**
   * 页面大小
   */
  size(): Promise<{
    width: number,     // 滚动宽度
    height: number     // 滚动高度
  }>

  /**
   * 页面滚动位置
   */
  scrollTop(): Promise<number>

  /**
   * 调用页面指定方法
   */
  callMethod(method:string): Promise<any>
}

interface MiniElement {

}
