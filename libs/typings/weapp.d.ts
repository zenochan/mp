/* eslint-disable camelcase */
import { Observable } from '../rx/Rx';

declare global {

  // <editor-fold desc="app and page">
  interface LaunchOptions {
    /** 打开小程序的路径 */
    path: string;
    /** 打开小程序的场景值 */
    scene: string;
    /** 打开小程序启动参数 query */
    query: object;
    /**
     * @see https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share.html
     */
    shareTicket: string;
    /**
     * 来源信息。
     * 从另一个小程序、公众号或 App 进入小程序时返回。否则返回 {}。
     */
    referrerInfo: object;

    // 小程序直播中产品跳转时携带的产生
    room_id: number;
    share_openid: string;
    openid: string;
    type: number;
    custom_params: string;

    [key: string]: any;
  }

  /**
   * App 实现的接口对象
   */
  interface IApp {
    [key: string]: any;

    /**
     * 生命周期函数--监听小程序初始化。当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
     */
    onLaunch?: (options: LaunchOptions) => void;

    /**
     * 生命周期函数--监听小程序显示。当小程序启动，或从后台进入前台显示，会触发 onShow
     */
    onShow?: (options: LaunchOptions) => void;

    /**
     * 生命周期函数--监听小程序隐藏。当小程序从前台进入后台，会触发 onHide
     */
    onHide?: () => void;

    /**
     * 错误监听函数--当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
     */
    onError?: (msg: string) => void;
  }

  /**
   * App() 函数用来注册一个小程序。接受一个 object 参数，其指定小程序的生命周期函数等。
   */
  function App(app?: IApp): void;

  /**
   * 获取小程序实例
   */
  function getApp<T extends IApp>(): T;

  /**
   * Page 实现的接口对象
   */
  interface IPage {
    nav?: (url: string, data?: any) => void;
    /** 20190416 */
    navTitle?: string;
    replace?: (url: string) => void;

    /**
     * 在 page.onShow 周期调用 page.onPullDownToRefresh
     * @since 2020年03月13日
     */
    autoRefresh?: boolean;

    /**
     * 同 {@link autoRefresh}, 但仅刷新一次，适合跳到详情，数据改变后执行
     */
    onceRefresh?: boolean;

    /**
     * 生命周期事件
     */
    zzLife?: () => Observable<String> | any;

    onDataChange?: Observable<any> | any;
    /**
     * 调用 setData 并触发 {@link onDataChange}
     * @param value
     */
    zzSetData?: (value: any) => void;

    /**
     * 参数
     */
    navParams?: any;

    readonly options?: LaunchOptions;
    /**
     * [read-only]页面的初始数据
     * 每次小程序打开，只会初始化一次，不要赋值动态的数据
     */
    data?: any;

    /**
     * 生命周期函数--监听页面加载
     * @param {LaunchOptions}
     */
    onLoad?: (options: LaunchOptions) => void;

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady?: () => void;

    /**
     * 生命周期函数--监听页面显示
     */
    onShow?: () => void;

    /**
     * 生命周期函数--监听页面隐藏
     * Tips: 仅在跳转到新页面时调用，返回时不调用
     */
    onHide?: () => void;

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload?: () => void;

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh?: () => void;

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom?: () => void;

    onShareAppMessage?: () => wx.ShareOptions;

    /**
     * 将数据从逻辑层发送到视图层，同时改变对应的 this.data 的值
     */
    setData?: (data: any) => void;

    /**
     * 强制更新
     */
    forceUpdate?: () => void;

    /**
     * 更新
     */
    update?: () => void;
    route?: string;

    onInput?: (event: WXEvent) => void;

    onBlur?: (event: WXEvent) => void;

    showModal?: (event: WXEvent | string) => void;
    hideModal?: (event: WXEvent | string) => void;

    selectComponent?: (selector: string) => any;

    [key: string]: any;

  }

  /**
   * Page() 函数用来注册一个页面。
   * 接受一个 object 参数，其指定页面的初始数据、生命周期函数、事件处理函数等。
   */
  function Page(page: IPage): void;

  /**
   * getCurrentPages() 函数用于获取当前页面栈的实例，
   * 以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面。
   */
  function getCurrentPages(): IPage[];

  // </editor-fold>

  // <editor-fold desc="component">
  interface Property {
    /**
     * String Number Boolean Object Array 其一，也可以为 null 表示不限制类型
     */
    type: any;
    value: any;
    observer?: string | ((newVal, oldVal) => void);
  }

  /**
   * 生命周期
   * 1. created
   * 2. attached
   * 3. ready
   * 4. moved
   * 5. detached
   */
  interface IComponent {
    /**
     * @param event 事件名称
     * @param eventDetail detail 对象， 提供给时间监听函数
     * @param eventOption 触发时间的选项
     */
    triggerEvent?: (event: string, eventDetail?: object, eventOption?: object) => void;

    createSelectorQuery?: Function;

    /**
     * 组件的对外属性，是属性名到属性设置的映射表，属性设置中可包含三个字段，
     * type 表示属性类型、 value 表示属性初始值、 observer 表示属性值被更改时的响应函数
     */
    properties?: { [key: string]: Property | any };

    /**
     * 组件的内部数据，和 properties 一同用于组件的模板渲染
     */
    data?: Object;

    /**
     * 组件的方法，包括事件响应函数和任意的自定义方法，关于事件响应函数的使用，参见 组件事件
     */
    methods?: {
      [key: string]: Function
    };

    /**
     * 类似于mixins和traits的组件间代码复用机制，参见 behaviors
     */
    behaviors?: string | string[];

    /**
     * 组件生命周期函数，在组件实例进入页面节点树时执行，注意此时不能调用 setData
     */
    created?: Function;

    /**
     * 组件生命周期函数，在组件实例进入页面节点树时执行
     */
    attached?: Function;

    /**
     * 组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息（使用 SelectorQuery ）
     */
    ready?: Function;

    /**
     * 件生命周期函数，在组件实例被移动到节点树另一个位置时执行
     */
    moved?: Function;

    /**
     * 组件生命周期函数，在组件实例被从页面节点树移除时执行
     */
    detached?: Function;

    /**
     * 组件间关系定义
     */
    relations?: {
      [key: string]: {
        type: 'parent' | 'child',
        linked?: (target) => void
      }
    };

    /**
     * 组件接受的外部样式类，参见 外部样式类
     */
    externalClasses?: string[];

    /**
     * 一些选项（文档中介绍相关特性时会涉及具体的选项设置，这里暂不列举）
     */
    options?: Object | {
      [key: string]: any,
      // 在组件定义时的选项中启用多slot支持
      multipleSlots: boolean,
      /**
       * 2.3.3 开始支持
       */
      addGlobalClass: boolean,

    };

    /**
     * 组件生命周期声明对象，
     * 组件的生命周期：created、attached、ready、moved、detached将收归到lifetimes字段内进行声明，
     * 原有声明方式仍旧有效，如同时存在两种声明方式，则lifetimes字段内声明方式优先级最高
     * @since 2.2.3
     */
    lifetimes?: {
      created?: () => void
      attached?: () => void
      ready?: () => void
      moved?: () => void
      detached?: () => void
    };

    /**
     * 组件所在页面的生命周期声明对象，目前仅支持页面的show和hide两个生命周期
     * @since 2.2.3
     */
    pageLifetimes?: {
      show?: () => void
      hide?: () => void
      /**
       * @since 2.4.0
       */
      resize?: (size) => void
    };

    /**
     *  定义段过滤器，用于自定义组件扩展
     *  @since 2.2.3
     */
    definitionFilter?: Function;

    [key: string]: any;

  }

  /**
   * Component构造器可用于定义组件，调用Component构造器时可以指定组件的属性、数据、方法等。
   */
  function Component(component: IComponent): void;

  // </editor-fold>

  // <editor-fold desc="wx">
  interface BaseOptions {

    /**
     * 接口调用成功的回调函数
     */
    success?: (res) => void;

    onLoad?: (options) => void;

    /**
     * 接口调用失败的回调函数
     */
    fail?: (e) => void;

    /**
     * 接口调用结束的回调函数（调用成功、失败都会执行）
     */
    complete?: () => void;

    [key: string]: any;
  }

  namespace wx {
    interface BaseOptions<T> {

      /**
       * 接口调用成功的回调函数
       */
      success?: (res: T) => void;

      onLoad?: (options) => void;

      /**
       * 接口调用失败的回调函数
       */
      fail?: (e) => void;

      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      complete?: () => void;

      [key: string]: any;
    }

    interface ShareOptions extends BaseOptions<any> {

      /**
       * 分享标题, 默认为当前小程序名称
       */
      title?: string;

      /**
       * 分享描述, 默认为当前小程序名称
       */
      desc?: string;

      /**
       * 分享路径, 默认为当前页面path, 必须是以 / 开头的完整路径
       */
      path?: string;

      /**
       * 自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，
       * 不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
       */
      imageUrl?: string;
    }

    interface IData {
      [key: string]: any;
    }

    function getLaunchOptionsSync(): LaunchOptions;

    // ---------------------------------- 网络API列表 ----------------------------------
    // <editor-fold desc="网络API列表">
    interface RequestResult {

      /**
       * 开发者服务器返回的内容
       */
      data: any;

      statusCode: number;
    }

    interface RequestOptions extends BaseOptions<any> {

      /**
       * 开发者服务器接口地址
       */
      url: string;

      /**
       * 请求的参数
       */
      data?: string | IData;

      /**
       * 设置请求的 header , header 中不能设置 Referer
       */
      header?: IData;

      /**
       * 默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
       */
      method?: string;

      /**
       * 收到开发者服务成功返回的回调函数，res = {data: '开发者服务器返回的内容'}
       */
      success?: (res?: RequestResult) => void;
    }

    /**
     * 发起网络请求。`wx.request`发起的是https请求。**一个微信小程序，同时只能有5个网络请求连接**。
     */
    function request(options: RequestOptions): any;

    interface UploadFileResult {
      /**
       * 开发者服务器返回的数据
       */
      data: string;

      /**
       * HTTP状态码
       */
      statusCode: number;
    }

    interface UploadFileOptions extends BaseOptions<any> {

      /**
       * 开发者服务器 url
       */
      url: string;

      /**
       * 要上传文件资源的路径
       */
      filePath: string;

      /**
       * 文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
       */
      name: string;

      /**
       * HTTP 请求 Header , header 中不能设置 Referer
       */
      header?: IData;

      /**
       * HTTP 请求中其他额外的 form data
       */
      formData?: IData;

      /**
       * 收到开发者服务成功返回的回调函数，res = {data: '开发者服务器返回的内容'}
       */
      success?: (res?: UploadFileResult) => void;
    }

    /**
     * 将本地资源上传到开发者服务器。
     * 如页面通过 [wx.chooseImage](#wx.chooseImage) 等接口获取到一个本地资源的临时文件路径后，可通过此接口将本地资源上传到指定服务器。
     * 客户端发起一个 HTTPS POST 请求，其中 `Content-Type` 为 `multipart/form-data` 。
     */
    function uploadFile(options: UploadFileOptions): void;

    interface DownloadFileResult {

      /**
       * 文件的临时路径
       */
      tempFilePath: string;
    }

    interface DownloadFileOptions extends BaseOptions<any> {

      /**
       * 下载资源的 url
       */
      url: string;

      /**
       * HTTP 请求 Header
       */
      header?: IData;

      /**
       * 下载成功后以 tempFilePath 的形式传给页面，res = {tempFilePath: '文件的临时路径'}
       */
      success?: (res?: DownloadFileResult) => void;
    }

    /**
     * 下载文件资源到本地。
     * 客户端直接发起一个 HTTP GET 请求，返回文件的本地临时路径。
     */
    function downloadFile(options: DownloadFileOptions): void;

    interface ConnectSocketOptions extends BaseOptions<any> {

      /**
       * 开发者服务器接口地址，必须是 wss 协议，且域名必须是后台配置的合法域名
       */
      url: string;

      /**
       * 请求的数据
       */
      data?: string;

      /**
       * HTTP Header , header 中不能设置 Referer
       */
      header?: IData;

      /**
       * 默认是GET，有效值为： OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
       */
      method?: string;
    }

    /**
     * 创建一个 [WebSocket](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket?t=1477656499061) 连接；
     * **一个微信小程序同时只能有一个 WebSocket 连接，如果当前已存在一个 WebSocket 连接，会自动关闭该连接，并重新创建一个 WebSocket 连接**。
     */
    function connectSocket(options: ConnectSocketOptions): void;

    /**
     * 监听WebSocket连接打开事件。
     */
    function onSocketOpen(callback: (res?: any) => void): void;

    /**
     * 监听WebSocket错误。
     */
    function onSocketError(callback: (res?: any) => void): void;

    interface SendSocketMessageOptions extends BaseOptions<any> {

      /**
       * 需要发送的内容
       */
      data: string | any[];
    }

    /**
     * 通过 WebSocket 连接发送数据，需要先 [wx.connectSocket](#wx.connectSocket)，并在 [wx.onSocketOpen](#wx.onSocketOpen) 回调之后才能发送。
     */
    function sendSocketMessage(options: SendSocketMessageOptions): void;

    interface SocketMessageResponse {

      /**
       * 服务器返回的消息
       */
      data: string | any[];
    }

    /**
     * 监听WebSocket接受到服务器的消息事件。
     */
    function onSocketMessage(callback: (res?: SocketMessageResponse) => void): void;

    /**
     * 关闭WebSocket连接。
     */
    function closeSocket(): void;

    /**
     * 监听WebSocket关闭。
     */
    function onSocketClose(callback: (res?: any) => void): void;

    // </editor-fold>

    // ---------------------------------- 媒体API列表 ----------------------------------
    // <editor-fold desc="媒体API列表">
    interface ChooseImageResult {

      /**
       * 本地文件路径列表
       */
      tempFilePaths: string;
    }

    interface ChooseImageOptions extends BaseOptions<any> {

      /**
       * 最多可以选择的图片张数，默认9
       */
      count?: number;

      /**
       * original 原图，compressed 压缩图，默认二者都有
       */
      sizeType?: string[];

      /**
       * album 从相册选图，camera 使用相机，默认二者都有
       */
      sourceType?: string[];

      /**
       * 成功则返回图片的本地文件路径列表 tempFilePaths
       */
      success?: (res?: ChooseImageResult) => void;
    }

    interface SaveImageToPhotoAlbumOptions extends BaseOptions<any> {
      // 图片文件路径，可以是临时文件路径或永久文件路径，不支持网络图片路径
      filePath: string;
    }

    function saveImageToPhotosAlbum(options: SaveImageToPhotoAlbumOptions);

    // /**
    //  * 从本地相册选择图片或使用相机拍照。
    //  */
    // function chooseImage(options: ChooseImageOptions): void;

    interface ChooseVideoOptions extends BaseOptions<any> {
      sourceType?: string[]; // default
      compressed?: boolean; // default true
      maxDuration?: number; // default 60
      camera?: 'back' | 'front'; // default back
    }

    interface ChooseVideoRes {
      tempFilePath: string;
      duration: number;
      size: number;
      height: number;
      width: number;
    }

    // /**
    //  * 拍摄视频或从手机相册中选视频。
    //  */
    // function chooseVideo(options: ChooseVideoOptions): void;

    // interface PreviewImageOptions extends BaseOptions<any> {
    //
    //   /**
    //    * 当前显示图片的链接，不填则默认为 urls 的第一张
    //    */
    //   current?: string;
    //
    //   /**
    //    * 需要预览的图片链接列表
    //    */
    //   urls: string[];
    // }

    // /**
    //  * 预览图片。
    //  */
    // function previewImage(options: PreviewImageOptions): void;
    //
    interface GetImageInfoResult {
      width: number; // 图片宽度，单位px 不考虑旋转。
      height: number; // 图片高度 单位px 不考虑旋转。
      path: string; // 图片的本地路径
      orientation: string; // 拍照时设备方向  @since 1.9.90
      type: string; // 图片格式       @since 1.9.90
    }

    interface GetImageInfoOptions extends BaseOptions<any> {
      src: string; //  图片的路径，可以是相对路径，临时文件路径，存储文件路径

      /**
       * 接口调用成功的回调函数，包含图片信息
       */
      success?: (res?: GetImageInfoResult) => void;
    }

    /**
     * 获取图片信息
     */
    function getImageInfo(options: GetImageInfoOptions): void;

    interface StartRecordResult {

      /**
       * 录音文件的临时路径
       */
      tempFilePath: string;
    }

    interface StartRecordOptions extends BaseOptions<any> {

      /**
       * 录音成功后调用，返回录音文件的临时文件路径，res = {tempFilePath: '录音文件的临时路径'}
       */
      success?: (res?: StartRecordResult) => void;
    }

    /**
     * 开始录音。当主动调用 `wx.stopRecord`，或者录音超过1分钟时自动结束录音，返回录音文件的临时文件路径。
     */
    function startRecord(options: StartRecordOptions): void;

    /**
     *​ 主动调用停止录音。
     */
    function stopRecord(): void;

    interface PlayVoiceOptions extends BaseOptions<any> {

      /**
       * 需要播放的语音文件的文件路径
       */
      filePath: string;
    }

    /**
     * 开始播放语音，同时只允许一个语音文件正在播放，如果前一个语音文件还没播放完，将中断前一个语音播放。
     */
    function playVoice(options: PlayVoiceOptions): void;

    /**
     * 暂停正在播放的语音。
     * 再次调用wx.playVoice播放同一个文件时，会从暂停处开始播放。如果想从头开始播放，需要先调用 wx.stopVoice。
     */
    function pauseVoice(): void;

    /**
     * 结束播放语音。
     */
    function stopVoice(): void;

    interface GetBackgroundAudioPlayerStateResult {

      /**
       * 选定音频的长度（单位：s），只有在当前有音乐播放时返回
       */
      duration: number;

      /**
       * 选定音频的播放位置（单位：s），只有在当前有音乐播放时返回
       */
      currentPosition: number;

      /**
       * 播放状态（2：没有音乐在播放，1：播放中，0：暂停中）
       */
      status: number;

      /**
       * 音频的下载进度（整数，80 代表 80%），只有在当前有音乐播放时返回
       */
      downloadPercent: number;

      /**
       * 歌曲数据链接，只有在当前有音乐播放时返回
       */
      dataUrl: string;
    }

    interface GetBackgroundAudioPlayerStateOptions extends BaseOptions<any> {

      /**
       * 接口调用成功的回调函数
       */
      success?: (res?: GetBackgroundAudioPlayerStateResult) => void;
    }

    /**
     * 获取音乐播放状态。
     */
    function getBackgroundAudioPlayerState(options: GetBackgroundAudioPlayerStateOptions): void;

    interface PlayBackgroundAudioOptions extends BaseOptions<any> {

      /**
       * 音乐链接
       */
      dataUrl: string;

      /**
       * 音乐标题
       */
      title?: string;

      /**
       * 封面URL
       */
      coverImgUrl?: string;
    }

    /**
     * 播放音乐，同时只能有一首音乐正在播放。
     */
    function playBackgroundAudio(options: PlayBackgroundAudioOptions): void;

    /**
     * 暂停播放音乐。
     */
    function pauseBackgroundAudio(): void;

    interface SeekBackgroundAudioOptions extends BaseOptions<any> {

      /**
       * 音乐位置，单位：秒
       */
      position: number;
    }

    /**
     * 播放音乐，同时只能有一首音乐正在播放。
     */
    function seekBackgroundAudio(options: SeekBackgroundAudioOptions): void;

    /**
     * 停止播放音乐。
     */
    function stopBackgroundAudio(): void;

    /**
     * 监听音乐播放。
     */
    function onBackgroundAudioPlay(callback: (res?: any) => void): void;

    /**
     * 监听音乐暂停。
     */
    function onBackgroundAudioPause(callback: (res?: any) => void): void;

    /**
     * 监听音乐停止。
     */
    function onBackgroundAudioStop(callback: (res?: any) => void): void;

    interface ChooseVideoResult {

      /**
       * 选定视频的临时文件路径
       */
      tempFilePath: string;

      /**
       * 选定视频的时间长度
       */
      duration: number;

      /**
       * 选定视频的数据量大小
       */
      size: number;

      /**
       * 返回选定视频的长
       */
      height: number;

      /**
       * 返回选定视频的宽
       */
      width: number;
    }

    interface ChooseVideoOptions extends BaseOptions<any> {

      /**
       * album 从相册选视频，camera 使用相机拍摄，默认为：['album', 'camera']
       */
      sourceType?: string[];

      /**
       * 拍摄视频最长拍摄时间，单位秒。最长支持60秒
       */
      maxDuration?: number;

      /**
       * 前置或者后置摄像头，默认为前后都有，即：['front', 'back']
       */
      camera?: string[];

      /**
       * 接口调用成功，返回视频文件的临时文件路径
       */
      success?: (res?: ChooseVideoResult) => void;
    }

    // /**
    //  * 拍摄视频或从手机相册中选视频，返回视频的临时文件路径。
    //  */
    // function chooseVideo(options: ChooseVideoOptions): void;

    /**
     * `audioContext` 通过 audioId 跟一个 audio 组件绑定，通过它可以操作一个 audio 组件。
     */
    interface AudioContext {

      /**
       * 音频的地址
       */
      setSrc(src: string): void;

      /**
       * 播放
       */
      play(): void;

      /**
       * 暂停
       */
      pause(): void;

      /**
       * 跳转到指定位置，单位 s
       */
      seek(position: number): void;
    }

    /**
     * 创建并返回 audio 上下文 `AudioContext` 对象
     */
    function createAudioContext(audioId: string): AudioContext;

    /**
     * `videoContext` 通过 videoId 跟一个 video 组件绑定，通过它可以操作一个 video 组件。
     */
    interface VideoContext {

      /**
       * 播放
       */
      play(): void;

      /**
       * 暂停
       */
      pause(): void;

      /**
       * 跳转到指定位置，单位 s
       */
      seek(position: number): void;

      /**
       * 发送弹幕，danmu 包含两个属性 text, color
       */
      sendDanmu(danmu: { text: string, color: string }): void;
    }

    /**
     * 创建并返回 video 上下文 `VideoContext` 对象
     */
    function createVideoContext(videoId: string): VideoContext;

    interface SaveFileResult {

      /**
       * 文件的保存路径
       */
      savedFilePath: string;
    }

    interface SaveFileOptions extends BaseOptions<any> {

      /**
       * 需要保存的文件的临时路径
       */
      tempFilePath: string;

      /**
       * 返回文件的保存路径，res = {savedFilePath: '文件的保存路径'}
       */
      success?: (res?: SaveFileResult) => void;
    }

    /**
     * 保存文件到本地。
     */
    function saveFile(options: SaveFileOptions): void;

    interface FileListItem {

      /**
       * 文件的本地路径
       */
      filePath: string;

      /**
       * 文件的保存时的时间戳，从1970/01/01 08:00:00 到当前时间的秒数
       */
      createTime: number;

      /**
       * 文件大小，单位B
       */
      size: number;
    }

    interface GetSavedFileListResult {

      /**
       * 接口调用结果
       */
      errMsg: string;

      /**
       * 文件列表
       */
      fileList: FileListItem[];
    }

    interface GetSavedFileListOptions extends BaseOptions<any> {

      /**
       * 接口调用成功的回调函数
       */
      success?: (res?: GetSavedFileListResult) => void;
    }

    /**
     * 获取本地已保存的文件列表
     */
    function getSavedFileList(options: GetSavedFileListOptions): void;

    interface GetSavedFileInfoResult {

      /**
       * 接口调用结果
       */
      errMsg: string;

      /**
       * 文件的保存时的时间戳，从1970/01/01 08:00:00 到当前时间的秒数
       */
      createTime: number;

      /**
       * 文件大小，单位B
       */
      size: number;
    }

    interface GetSavedFileInfoOptions extends BaseOptions<any> {

      /**
       * 文件路径
       */
      filePath: string;

      /**
       * 接口调用成功的回调函数
       */
      success?: (res?: GetSavedFileInfoResult) => void;
    }

    /**
     * 获取本地文件的文件信息
     */
    function getSavedFileInfo(options: GetSavedFileInfoOptions): void;

    interface RemoveSavedFileOptions extends BaseOptions<any> {

      /**
       * 需要删除的文件路径
       */
      filePath: string;
    }

    /**
     * 删除本地存储的文件
     */
    function removeSavedFile(options: RemoveSavedFileOptions): void;

    interface OpenDocumentOptions extends BaseOptions<any> {

      /**
       * 文件路径，可通过 downFile 获得
       */
      filePath: string;
    }

    /**
     * 新开页面打开文档，支持格式：doc, xls, ppt, pdf, docx, xlsx, pptx
     */
    function openDocument(options: OpenDocumentOptions): void;

    // </editor-fold>

    // ---------------------------------- 数据API列表 ----------------------------------
    // <editor-fold desc="数据API列表">
    interface SetStorageOptions extends BaseOptions<any> {
      /**
       * 本地缓存中的指定的 key
       */
      key: string;

      /**
       * 需要存储的内容
       */
      data: any;
    }

    /**
     * 将数据存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个异步接口。
     */
    function setStorage(options: SetStorageOptions): void;

    /**
     * 将 data 存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个同步接口。
     */
    function setStorageSync(key: string, data: any): void;

    interface GetStorageResult {

      /**
       * key对应的内容
       */
      data: any;
    }

    interface GetStorageOptions extends BaseOptions<any> {

      /**
       * 本地缓存中的指定的 key
       */
      key: string;

      /**
       * 接口调用的回调函数,res = {data: key对应的内容}
       */
      success?: (res?: GetStorageResult) => void;
    }

    /**
     * 从本地缓存中异步获取指定 key 对应的内容。
     */
    function getStorage(options: GetStorageOptions): void;

    /**
     * 从本地缓存中同步获取指定 key 对应的内容。
     */
    function getStorageSync(key: string): any;

    interface GetStorageInfoResult {

      /**
       * 当前storage中所有的key
       */
      keys: string[];

      /**
       * 当前占用的空间大小, 单位kb
       */
      currentSize: number;

      /**
       * 限制的空间大小，单位kb
       */
      limitSize: number;
    }

    interface GetStorageInfoOptions extends BaseOptions<any> {

      /**
       * 接口调用的回调函数
       */
      success?: (res?: GetStorageInfoResult) => void;
    }

    /**
     * 从本地缓存中异步获取指定 key 对应的内容。
     */
    function getStorageInfo(options: GetStorageInfoOptions): void;

    /**
     * 从本地缓存中同步获取指定 key 对应的内容。
     */
    function getStorageInfoSync(): GetStorageInfoResult;

    interface RemoveStorageOptions extends BaseOptions<any> {

      /**
       * 本地缓存中的指定的 key
       */
      key: string;
    }

    /**
     * 从本地缓存中异步移除指定 key 。
     */
    function removeStorage(options: RemoveStorageOptions): void;

    /**
     * 从本地缓存中同步移除指定 key 。
     */
    function removeStorageSync(key: string): void;

    /**
     * 清理本地数据缓存。
     */
    function clearStorage(): void;

    /**
     * 同步清理本地数据缓存。
     */
    function clearStorageSync(): void;

    // </editor-fold>

    // ---------------------------------- 位置API列表 ----------------------------------
    // <editor-fold desc="位置API列表">
    interface Location {
      /**
       * 纬度，浮点数，范围为-90~90，负数表示南纬
       */
      latitude: number;

      /**
       * 经度，浮点数，范围为-180~180，负数表示西经
       */
      longitude: number;
    }

    interface GetLocationResult extends Location {

      /**
       * 速度，浮点数，单位m/s
       */
      speed: number;

      altitude: 0;
      errMsg: string;
      latitude: number;
      longitude: number;

      /**
       * 位置的精确度
       */
      accuracy: number;
      verticalAccuracy: 65;
      horizontalAccuracy: 65;
    }

    interface GetLocationOptions extends BaseOptions<any> {

      /**
       * 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 `wx.openLocation` 的坐标
       */
      type?: string;

      // 高度信息
      altitude?: boolean;

      // 高精度定位
      isHighAccuracy?: boolean;

      /**
       * 接口调用成功的回调函数
       */
      success?: (res?: GetLocationResult) => void;
    }

    /**
     * 获取当前的地理位置、速度。
     */
    function getLocation(options: GetLocationOptions): void;

    interface ChooseLocationResult extends Location {

      /**
       * 位置名称
       */
      name: string;

      /**
       * 详细地址
       */
      address: string;
    }

    interface ChooseLocationOptions extends BaseOptions<any> {

      /**
       * 接口调用成功的回调函数
       */
      success?: (res?: ChooseLocationResult) => void;
    }

    /**
     * 打开地图选择位置
     */
    function chooseLocation(options: ChooseLocationOptions): void;

    interface OpenLocationOptions extends BaseOptions<any>, Location {

      /**
       * 缩放比例，范围1~28，默认为28
       */
      scale?: number;

      /**
       * 位置名
       */
      name?: string;

      /**
       * 地址的详细说明
       */
      address?: string;
    }

    /**
     * 使用微信内置地图查看位置
     */
    function openLocation(options: OpenLocationOptions): void;

    interface GetCenterLocationOptions extends BaseOptions<any> {

      /**
       * 接口调用成功的回调函数 ，res = { longitude: "经度", latitude: "纬度"}
       */
      success?: (res?: Location) => void;
    }

    /**
     * mapContext 通过 mapId 跟一个 <map/> 组件绑定，通过它可以操作对应的 <map/> 组件。
     */
    interface MapContext {

      /**
       * 获取当前地图中心的经纬度，返回的是 gcj02 坐标系，可以用于 wx.openLocation
       */
      getCenterLocation(options: GetCenterLocationOptions): void;

      /**
       * 将地图中心移动到当前定位点，需要配合map组件的show-location使用
       */
      moveToLocation(): void;
    }

    /**
     * 创建并返回 map 上下文 mapContext 对象
     */
    function createMapContext(mapId: string): MapContext;

    // </editor-fold>

    // ---------------------------------- 设备API列表 ----------------------------------
    // <editor-fold desc="设备API列表">
    interface GetNetworkTypeResult {

      /**
       * 网络类型
       */
      networkType: '2g' | '3g' | '4g' | 'wifi';
    }

    interface GetNetworkTypeOptions extends BaseOptions<any> {

      /**
       * 接口调用成功，返回网络类型 networkType
       */
      success?: (res?: GetNetworkTypeResult) => void;
    }

    /**
     * 获取网络类型。
     */
    function getNetworkType(options: GetNetworkTypeOptions): void;

    interface GetSystemInfoResult {
      model: string; // 手机型号
      pixelRatio: number; // 设备像素比
      windowWidth: number; // 窗口宽度
      windowHeight: number; // 窗口高度
      language: string; // 微信设置的语言
      version: string; // 微信版本号
      system: string; // 操作系统版本
      platform: string; // 客户端平台

      // from v2.6.0
      locationAuthorized: boolean; // 允许微信使用定位的开关
      safeArea: { // 竖屏正方向下的安全区域
        left: number,
        right: number,
        top: number,
        bottom: number,
        width: number,
        height: number,
        paddingBottom: number // 自定义附加，底部安全距离
      };

      statusBarHeight: number; // 状态栏高度
      navigationHeight: number; // custom, 导航栏高度

      [key: string]: any;
    }

    interface GetSystemInfoOptions extends BaseOptions<any> {

      /**
       * 接口调用成功的回调
       */
      success?: (res?: GetSystemInfoResult) => void;
    }

    /**
     * 获取系统信息。
     */
    function getSystemInfo(options: GetSystemInfoOptions): void;

    function nextTick(task: () => void);

    /**
     * 获取系统信息同步接口
     */
    function getSystemInfoSync(): GetSystemInfoResult;

    /**
     * #### 判断小程序的API，回调，参数，组件等是否在当前版本可用。
     *
     * ```
     * wx.canIUse('openBluetoothAdapter')
     * wx.canIUse('getSystemInfoSync.return.screenWidth')
     * wx.canIUse('getSystemInfo.success.screenWidth')
     * wx.canIUse('showToast.object.image')
     * wx.canIUse('onCompassChange.callback.direction')
     * wx.canIUse('request.object.method.GET')
     *
     * wx.canIUse('live-player')
     * wx.canIUse('text.selectable')
     * wx.canIUse('button.open-type.contact')
     * ```
     *
     * @param api 使用${API}.${method}.${param}.${options}或者${component}.${attribute}.${option}方式来调用
     *   <li>${API} 代表 API 名字
     *   <li>${method} 代表调用方式，有效值为return, success, object, callback
     *   <li>${param} 代表参数或者返回值
     *   <li>${options} 代表参数的可选值
     *   <li>${component} 代表组件名字
     *   <li>${attribute} 代表组件属性
     *   <li>${option} 代表组件属性的可选值
     *
     * @since v1.1.1
     * @see <a href="https://developers.weixin.qq.com/miniprogram/dev/api/api-caniuse.html">can i use</a>
     */
    function canIUse(api: string): boolean;

    interface AccelerometerChangeResponse {

      /**
       * X 轴
       */
      x: number;

      /**
       * Y 轴
       */
      y: number;

      /**
       * Z 轴
       */
      z: number;
    }

    /**
     * 监听重力感应数据，频率：5次/秒
     */
    function onAccelerometerChange(callback: (res?: AccelerometerChangeResponse) => void): void;

    interface CompassChangeResponse {

      /**
       * 面对的方向度数
       */
      direction: number;
    }

    /**
     * 监听罗盘数据，频率：5次/秒
     */
    function onCompassChange(callback: (res?: CompassChangeResponse) => void): void;

    interface MakePhoneCallOptions {

      /**
       * 需要拨打的电话号码
       */
      phoneNumber: number | string;
    }

    /**
     * 拨打电话
     */
    function makePhoneCall(options: MakePhoneCallOptions): void;

    interface ScanCodeResult {

      /**
       * 码的内容
       */
      result: string;

      /**
       * 所扫码的类型
       */
      scanType: string;

      /**
       * 所扫码的字符集
       */
      charSet: string;

      /**
       * 当所扫的码为当前小程序的合法二维码时，会返回此字段，内容为二维码携带的 path
       */
      path: string;
    }

    interface ScanCodeOptions extends BaseOptions<any> {
      /**
       * default false  是否只能从相机扫码，不允许从相册选择图片  1.2.0
       */
      onlyFromCamera?: boolean;
      /**
       * default ['barCode', 'qrCode']  否  扫码类型  1.7.0
       *
       * ## 合法值
       * - barCode  一维码
       * - qrCode  二维码
       * - datamatrix  Data Matrix 码
       * - pdf417  PDF417 条码
       */
      scanType?: string[];

      /**
       * 接口调用成功的回调函数
       */
      success?: (res?: ScanCodeResult) => void;
    }

    /**
     * 调起客户端扫码界面，扫码成功后返回对应的结果
     */
    function scanCode(options: ScanCodeOptions): void;

    // </editor-fold>

    // ---------------------------------- 界面API列表 ----------------------------------
    // <editor-fold desc="界面API列表">
    interface ShowToastOptions extends BaseOptions<any> {

      /**
       * 提示的内容
       */
      title: string;

      /**
       * 图标，只支持"success"、"loading"
       */
      icon?: 'success' | 'loading';

      /**
       * 提示的延迟时间，单位毫秒，默认：1500, 最大为10000
       */
      duration?: number;

      /**
       * 是否显示透明蒙层，防止触摸穿透，默认：false
       */
      mask?: boolean;
    }

    /**
     * 显示消息提示框
     */
    function showToast(options: ShowToastOptions): void;

    /**
     * 隐藏消息提示框
     */
    function hideToast(): void;

    interface ShowModalResult {

      /**
       * confirm==1时，表示用户点击确定按钮
       */
      confirm: number;
    }

    interface ShowModalOptions extends BaseOptions<any> {

      /**
       * 提示的标题
       */
      title: string;

      /**
       * 提示的内容
       */
      content: string;

      /**
       * 是否显示取消按钮，默认为 true
       */
      showCancel?: boolean;

      /**
       * 取消按钮的文字，默认为"取消"
       */
      cancelText?: string;

      /**
       * 取消按钮的文字颜色，默认为"#000000"
       */
      cancelColor?: string;

      /**
       * 确定按钮的文字，默认为"确定"
       */
      confirmText?: string;

      /**
       * 确定按钮的文字颜色，默认为"#3CC51F"
       */
      confirmColor?: string;

      /**
       * 接口调用成功的回调函数，返回res.confirm==1时，表示用户点击确定按钮
       */
      success?: (res?: ShowModalResult) => void;
    }

    /**
     * 显示消息提示框
     */
    function showModal(options: ShowModalOptions): void;

    interface ShowActionSheetResult {

      /**
       * 用户是否取消选择
       */
      cancel: boolean;

      /**
       * 用户点击的按钮，从上到下的顺序，从0开始
       */
      tapIndex: number;
    }

    interface ShowActionSheetOptions extends BaseOptions<any> {

      /**
       * 按钮的文字数组，数组长度最大为6个
       */
      itemList: string[];

      /**
       * 按钮的文字颜色，默认为"#000000"
       */
      itemColor?: string;

      /**
       * 接口调用成功的回调函数
       */
      success?: (res?: ShowActionSheetResult) => void;
    }

    /**
     * 显示操作菜单
     */
    function showActionSheet(options: ShowActionSheetOptions): void;

    interface SetNavigationBarTitleOptions extends BaseOptions<any> {

      /**
       * 页面标题
       */
      title: string;
    }

    /**
     * 动态设置当前页面的标题。
     */
    function setNavigationBarTitle(options: SetNavigationBarTitleOptions): void;

    interface NavbarColorOptions extends BaseOptions<any> {
      /** 前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000 */
      frontColor: string;
      /** 背景颜色值，有效值为十六进制颜色 */
      backgroundColor: string;
      /** 动画效果 */
      animation?: {
        /** 动画变化时间，默认0，单位：毫秒 */
        duration?: number,
        /**
         * 动画变化方式，默认 linear
         * - linear  动画从头到尾的速度是相同的。
         * - easeIn  动画以低速开始
         * - easeOut  动画以低速结束。
         * - easeInOut  动画以低速开始和结束。
         */
        timingFunc?: string
      };
    }

    function setNavigationBarColor(options: NavbarColorOptions);

    /**
     * 在当前页面显示导航条加载动画。
     */
    function showNavigationBarLoading(): void;

    /**
     * 隐藏导航条加载动画。
     */
    function hideNavigationBarLoading(): void;

    interface NavigateToOptions extends BaseOptions<any> {

      /**
       * 需要跳转的应用内页面的路径 , 路径后可以带参数。
       * 参数与路径之间使用?分隔，参数键与参数值用=相连，不同参数用&分隔；如 'path?key=value&key2=value2'
       */
      url: string;
    }

    /**
     * 保留当前页面，跳转到应用内的某个页面，使用 `wx.navigateBack` 可以返回到原页面。
     */
    function navigateTo(options: NavigateToOptions): void;

    interface MiniProgramOptions extends BaseOptions<any> {
      /**
       * 要打开的小程序 appId
       */
      appId: string;

      /**
       * 打开的页面路径，如果为空则打开首页。
       * path 中 ? 后面的部分会成为 query，在小程序的 App.onLaunch、App.onShow 和 Page.onLoad 的回调函数
       * 或小游戏的 wx.onShow 回调函数、wx.getLaunchOptionsSync 中可以获取到 query 数据。
       * 对于小游戏，可以只传入 query 部分，来实现传参效果，如：传入 "?foo=bar"。
       */
      path?: string;
      /**
       * 需要传递给目标小程序的数据，目标小程序可在 App.onLaunch，App.onShow 中获取到这份数据。
       * 如果跳转的是小游戏，可以在 wx.onShow、wx.getLaunchOptionsSync 中可以获取到这份数据数据。
       */
      extraData?: object;
      /**
       * 要打开的小程序版本。仅在当前小程序为开发版或体验版时此参数有效。如果当前小程序是正式版，则打开的小程序必定是正式版。
       * - develop  开发版
       * - trial  体验版
       * - release  正式版
       */
      envVersion?: 'release' | 'trial' | 'develop';
    }

    function navigateToMiniProgram(options: MiniProgramOptions);

    interface RedirectToOptions extends BaseOptions<any> {

      /**
       * 需要跳转的应用内页面的路径
       */
      url: string;
    }

    /**
     * 关闭当前页面，跳转到应用内的某个页面。
     */
    function reLaunch(options: RedirectToOptions): void;

    /**
     * 关闭当前页面，跳转到应用内的某个页面。
     */
    function redirectTo(options: RedirectToOptions): void;

    interface SwitchTabOptions extends BaseOptions<any> {
      /**
       * 需要跳转的 tabBar 页面的路径（需在 app.json 的 tabBar 字段定义的页面），路径后不能带参数
       */
      url: string;
    }

    /**
     * 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
     */
    function switchTab(options: SwitchTabOptions): void;

    interface NavigateBackOptions extends BaseOptions<any> {
      /**
       * 返回的页面数，如果 delta 大于现有页面数，则返回到首页。默认值为1。
       */
      delta?: number;
    }

    /**
     * > 关闭当前页面，返回上一页面或多级页面。可通过 __getCurrentPages()__ 获取当前的页面栈，决定需要返回几层。
     * - 调用此方法成功时，会自动关闭当前页面的 loading / toast / modal 交互
     * - 需要提示的 toast / modal 需要在此方法之后调用
     */
    function navigateBack(options?: NavigateBackOptions): void;

    /**
     * 动画实例可以调用以下方法来描述动画，调用结束后会返回自身，支持链式调用的写法。
     */
    interface Animation {

      /**
       * 表示一组动画完成，可以在一组动画中调用任意多个动画方法，一组动画中的所有动画会同时开始，一组动画完成后才会进行下一组动画。
       */
      step(options?: AnimationOptions): Animation;

      /**
       * 导出动画数据传递给组件的animation属性
       */
      export(): any;

      // 样式

      /**
       * 透明度，参数范围 0~1
       */
      opacity(value: number): this;

      /**
       * 颜色值
       */
      backgroundColor(color: string): this;

      /**
       * 长度值，如果传入 number 则默认使用 px，可传入其他自定义单位的长度值
       */
      width(value: number | string): this;

      /**
       * 长度值，如果传入 number 则默认使用 px，可传入其他自定义单位的长度值
       */
      height(value: number | string): this;

      /**
       * 长度值，如果传入 number 则默认使用 px，可传入其他自定义单位的长度值
       */
      top(value: number | string): this;

      /**
       * 长度值，如果传入 number 则默认使用 px，可传入其他自定义单位的长度值
       */
      left(value: number | string): this;

      /**
       * 长度值，如果传入 number 则默认使用 px，可传入其他自定义单位的长度值
       */
      bottom(value: number | string): this;

      /**
       * 长度值，如果传入 number 则默认使用 px，可传入其他自定义单位的长度值
       */
      right(value: number | string): this;

      // 旋转

      /**
       * deg的范围-180~180，从原点顺时针旋转一个deg角度
       */
      rotate(value: number): this;

      /**
       * deg的范围-180~180，在X轴旋转一个deg角度
       */
      rotateX(value: number): this;

      /**
       * deg的范围-180~180，在Y轴旋转一个deg角度
       */
      rotateY(value: number): this;

      /**
       * deg的范围-180~180，在Z轴旋转一个deg角度
       */
      rotateZ(value: number): this;

      /**
       * 同 [transform-function rotate3d](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/rotate3d?t=1477656494026)
       */
      rotate3d(x: number, y: number, z: number, a: number): this;

      // 缩放

      /**
       * 一个参数时，表示在X轴、Y轴同时缩放sx倍数；两个参数时表示在X轴缩放sx倍数，在Y轴缩放sy倍数
       */
      scale(sx: number, sy?: number): this;

      /**
       * 在X轴缩放sx倍数
       */
      scaleX(sx: number): this;

      /**
       * 在Y轴缩放sy倍数
       */
      scaleY(sy: number): this;

      /**
       * 在Z轴缩放sz倍数
       */
      scaleZ(sz: number): this;

      /**
       * 在X轴缩放sx倍数，在Y轴缩放sy倍数，在Z轴缩放sz倍数
       */
      scale3d(sx: number, sy: number, sz: number): this;

      // 偏移

      /**
       * 一个参数时，表示在X轴偏移tx，单位px；两个参数时，表示在X轴偏移tx，在Y轴偏移ty，单位px。
       */
      translate(tx: number, ty?: number): this;

      /**
       * 在X轴偏移tx，单位px
       */
      translateX(tx: number): this;

      /**
       * 在Y轴偏移ty，单位px
       */
      translateY(ty: number): this;

      /**
       * 在Z轴偏移tz，单位px
       */
      translateZ(tz: number): this;

      /**
       * 在X轴偏移tx，在Y轴偏移ty，在Z轴偏移tz，单位px
       */
      translate3d(tx: number, ty: number, tz: number): this;

      // 倾斜

      /**
       * 参数范围-180~180；一个参数时，Y轴坐标不变，X轴坐标延顺时针倾斜ax度；两个参数时，分别在X轴倾斜ax度，在Y轴倾斜ay度
       */
      skew(ax: number, ay?: number): this;

      /**
       * 参数范围-180~180；Y轴坐标不变，X轴坐标延顺时针倾斜ax度
       */
      skewX(ax: number): this;

      /**
       * 参数范围-180~180；X轴坐标不变，Y轴坐标延顺时针倾斜ay度
       */
      skewY(ay: number): this;

      // 矩阵变形

      /**
       * 同 [transform-function matrix](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix?t=1477656494026)
       */
      matrix(a: number, b: number, c: number, d: number, tx: number, ty: number): this;

      /**
       * 同 [transform-function matrix3d](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix3d?t=1477656494026)
       */
      matrix3d(a1: number, b1: number, c1: number, d1: number, a2: number, b2: number, c2: number, d2: number,
        a3: number, b3: number, c3: number, d3: number, a4: number, b4: number, c4: number, d4: number): this;
    }

    interface AnimationOptions {

      /**
       * 动画持续时间，单位ms，默认值 400
       */
      duration?: number;

      /**
       * 定义动画的效果，默认值"linear"
       */
      timingFunction?: 'linear' | 'ease' | 'ease-in' | 'ease-in-out' | 'ease-out' | 'step-start' | 'step-end';

      /**
       * 动画延迟时间，单位 ms，默认值 0
       */
      delay?: number;

      /**
       * 设置transform-origin，默认为"50% 50% 0"
       */
      transformOrigin?: string;
    }

    function createAnimation(options?: AnimationOptions): Animation;

    interface CanvasContext {

      /**
       * 获取当前 `context` 上存储的绘图动作
       */
      getActions(): any[];

      /**
       * 清空当前的存储绘图动作
       */
      clearActions(): void;

      // 变形

      /**
       * 在调用 `scale` 方法后，之后创建的路径其横纵坐标会被缩放。多次调用 `scale`，倍数会相乘。
       * @param scaleWidth 横坐标缩放的倍数
       * @param scaleHeight 纵坐标轴缩放的倍数
       */
      scale(scaleWidth: number, scaleHeight: number): void;

      /**
       * 以原点为中心，原点可以用 translate方法修改。顺时针旋转当前坐标轴。多次调用rotate，旋转的角度会叠加。
       * @param rotate 旋转角度，以弧度计，范围为 0 ~ 2π
       */
      rotate(rotate: number): void;

      /**
       * 对当前坐标系的原点(0, 0)进行变换，默认的坐标系原点为页面左上角。
       * @param x 水平坐标平移量
       * @param y 竖直坐标平移量
       */
      translate(x: number, y: number): void;

      /**
       * 保存当前坐标轴的缩放、旋转、平移信息
       */
      save(): void;

      /**
       * 恢复之前保存过的坐标轴的缩放、旋转、平移信息
       */
      restore(): void;

      // 绘制

      /**
       * 清除画布上在该矩形区域内的内容。
       * @param x 矩形区域左上角的x坐标
       * @param y 矩形区域左上角的y坐标
       * @param width 矩形区域的宽度
       * @param height 矩形区域的高度
       */
      clearRect(x: number, y: number, width: number, height: number): void;

      /**
       * 在画布上绘制被填充的文本。
       * @param text 在画布上输出的文本
       * @param x  绘制文本的左上角x坐标位置
       * @param y 绘制文本的左上角y坐标位置
       */
      fillText(text: string, x: number, y: number): void;

      /**
       * 绘制图像，图像保持原始尺寸。
       * @param imageResource 所要绘制的图片资源，通过 `chooseImage` 得到一个文件路径或者一个项目目录内的图片
       * @param x 图像左上角的x坐标
       * @param y 图像左上角的y坐标
       * @param width
       * @param height
       */
      drawImage(imageResource: string, x: number, y: number, width: number, height: number): void;

      /**
       * # 绘制图像到画布
       *
       * @param imageResource 所要绘制的图片资源（网络图片要通过 getImageInfo / downloadFile 先下载）
       * @param sx            需要绘制到画布中的，imageResource的矩形（裁剪）选择框的左上角 x 坐标
       * @param sy            需要绘制到画布中的，imageResource的矩形（裁剪）选择框的左上角 y 坐标
       * @param sWidth        需要绘制到画布中的，imageResource的矩形（裁剪）选择框的宽度
       * @param sHeight       需要绘制到画布中的，imageResource的矩形（裁剪）选择框的高度
       * @param dx            imageResource的左上角在目标 canvas 上 x 轴的位置
       * @param dy            imageResource的左上角在目标 canvas 上 y 轴的位置
       * @param dWidth        在目标画布上绘制imageResource的宽度，允许对绘制的imageResource进行缩放
       * @param dHeight       在目标画布上绘制imageResource的高度，允许对绘制的imageResource进行缩放
       *
       * @since 1.9.0
       */
      drawImage(
        imageResource: string, sx: number, sy: number, sWidth: number, sHeight: number,
        dx: number, dy: number, dWidth: number, dHeight: number,
      ): void;

      /**
       * 对当前路径进行填充
       */
      fill(): void;

      /**
       * 对当前路径进行描边
       */
      stroke(): void;

      // 路径后可以带参数。

      /**
       * 开始创建一个路径，需要调用fill或者stroke才会使用路径进行填充或描边。
       * 同一个路径内的多次 `setFillStyle`、`setStrokeStyle`、`setLineWidth` 等设置，以最后一次设置为准。
       */
      beginPath(): void;

      /**
       * 关闭一个路径
       */
      closePath(): void;

      /** 把路径移动到画布中的指定点，不创建线条。
       * @param x 目标位置的x坐标
       * @param y 目标位置的y坐标
       */
      moveTo(x: number, y: number): void;

      /**
       * 在当前位置添加一个新点，然后在画布中创建从该点到最后指定点的路径。
       * @param x 目标位置的x坐标
       * @param y 目标位置的y坐标
       */
      lineTo(x: number, y: number): void;

      /**
       * 画一条弧线。
       * 创建一个圆可以用 arc() 方法指定其实弧度为0，终止弧度为 2 * Math.PI。
       * 用 stroke() 或者 fill() 方法来在 canvas 中画弧线。
       * @param x 圆的x坐标
       * @param y 圆的y坐标
       * @param r 圆的半径
       * @param sAngle 起始弧度，单位弧度（在3点钟方向）
       * @param eAngle 终止弧度
       * @param counterclockwise 可选。指定弧度的方向是逆时针还是顺时针。默认是false，即顺时针。
       */
      arc(x: number, y: number, r: number, sAngle: number, eAngle: number, counterclockwise?: boolean): void;

      /**
       * https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.clip.html
       * 从原始画布中剪切任意形状和尺寸。
       * 一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内（不能访问画布上的其他区域）。
       * 可以在使用 clip 方法前通过使用 save 方法对当前画布区域进行保存，
       * 并在以后的任意时间通过restore方法对其进行恢复。
       *
       * ```ts
       * ctx.save()
       * ctx.clip()
       * // drawing everything
       * ctx.restore()
       */
      clip(): void;

      /**
       * 添加一个矩形路径到当前路径。
       * @param x 矩形路径左上角的x坐标
       * @param y 矩形路径左上角的y坐标
       * @param width 矩形路径的宽度
       * @param height 矩形路径的高度
       */
      rect(x: number, y: number, width: number, height: number): void;

      /**
       * 填充一个矩形。用 setFillStyle() 设置矩形的填充色，如果没设置默认是黑色。
       * @param x 矩形路径左上角的x坐标
       * @param y 矩形路径左上角的y坐标
       * @param width 矩形路径的宽度
       * @param height 矩形路径的高度
       */
      fillRect(x: number, y: number, width: number, height: number): void;

      /**
       * 画一个矩形(非填充)。用 setFillStroke() 设置矩形线条的颜色，如果没设置默认是黑色。
       * @param x 矩形路径左上角的x坐标
       * @param y 矩形路径左上角的y坐标
       * @param width 矩形路径的宽度
       * @param height 矩形路径的高度
       */
      strokeRect(x: number, y: number, width: number, height: number): void;

      /**
       * 创建二次贝塞尔曲线路径。
       * @param cpx 贝塞尔控制点的x坐标
       * @param cpy 贝塞尔控制点的y坐标
       * @param x 结束点的x坐标
       * @param y 结束点的y坐标
       */
      quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;

      /**
       * 创建三次方贝塞尔曲线路径。
       * @param cp1x 第一个贝塞尔控制点的 x 坐标
       * @param cp1y 第一个贝塞尔控制点的 y 坐标
       * @param cp2x 第二个贝塞尔控制点的 x 坐标
       * @param cp2y 第二个贝塞尔控制点的 y 坐标
       * @param x 结束点的x坐标
       * @param y 结束点的y坐标
       */
      bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;

      // 样式

      /**
       * 设置纯色填充。
       * @param color 设置为填充样式的颜色('rgb(255, 0, 0)'或'rgba(255, 0, 0, 0.6)'或'#ff0000'格式的颜色字符串)
       */
      setFillStyle(color: string): void;

      /**
       * 设置纯色描边
       * @param color 设置为填充样式的颜色('rgb(255, 0, 0)'或'rgba(255, 0, 0, 0.6)'或'#ff0000'格式的颜色字符串)
       */
      setStrokeStyle(color: string): void;

      /**
       * 设置全局画笔透明度。
       * @param alpha 透明度，0 表示完全透明，1 表示完全不透明
       */
      setGlobalAlpha(alpha: number): void;

      /**
       * 设置阴影样式。
       * @param offsetX 阴影相对于形状在水平方向的偏移
       * @param offsetY 阴影相对于形状在竖直方向的偏移
       * @param blur 阴影的模糊级别，数值越大越模糊(0~100)
       * @param color 阴影的颜色('rgb(255, 0, 0)'或'rgba(255, 0, 0, 0.6)'或'#ff0000'格式的颜色字符串)
       */
      setShadow(offsetX: number, offsetY: number, blur: number, color: string): void;

      /**
       * 创建一个线性的渐变颜色。需要使用 addColorStop() 来指定渐变点，至少要两个。
       * @param x0 起点的x坐标
       * @param y0 起点的y坐标
       * @param x1 终点的x坐标
       * @param y1 终点的y坐标
       */
      createLinearGradient(x0: number, y0: number, x1: number, y1: number): void;

      /**
       * 创建一个圆形的渐变颜色。起点在圆心，终点在圆环。需要使用 addColorStop() 来指定渐变点，至少要两个。
       * @param x 圆心的x坐标
       * @param y 圆心的y坐标
       * @param r 圆的半径
       */
      createCircularGradient(x: number, y: number, r: number): void;

      /**
       * 设置字体的字号。
       * @param fontSize 字体的字号
       */
      setFontSize(fontSize: number): void;

      /**
       * 设置线条的宽度。
       * @param lineWidth 线条的宽度
       */
      setLineWidth(lineWidth: number): void;

      /**
       * 设置线条的结束端点样式。
       * @param lineCap 线条的结束端点样式('butt'、'round'、'square')
       */
      setLineCap(lineCap: string): void;

      /**
       * 设置两条线相交时，所创建的拐角类型。
       * @param lineJoin 两条线相交时，所创建的拐角类型('bevel'、'round'、'miter')
       */
      setLineJoin(lineJoin: string): void;

      /** 设置最大斜接长度，斜接长度指的是在两条线交汇处内角和外角之间的距离。 当setLineJoin为'miter'时才有效。超过最大倾斜长度的，连接处将以lineJoin为bevel来显示
       * @param miterLimit 最大斜接长度
       */
      setMiterLimit(miterLimit: number): void;

      /**
       *
       * @param reserve 本次绘制是否接着上一次绘制。
       * 即 reserve 参数为 false，则在本次调用绘制之前 native 层会先清空画布再继续绘制；
       * 若 reserve 参数为 true，则保留当前画布上的内容，
       * 本次调用 drawCanvas 绘制的内容覆盖在上面，默认 false。
       * @param callback 绘制完成后执行的回调函数
       */
      draw(reserve?: boolean, callback?: () => void): void;
    }

    /**
     * 创建 canvas 绘图上下文(指定 canvasId)
     * @param canvasId 画布表示，传入定义在 <canvas/> 的 canvas-id
     * @param component
     */
    function createCanvasContext(canvasId: string, component?: IComponent): CanvasContext;

    /**
     * 创建并返回绘图上下文context对象。
     */
    function createContext(): CanvasContext;

    interface DrawCanvasOptions {

      /**
       * 画布标识，传入 <canvas/> 的 cavas-id
       */
      canvasId: string;

      /**
       * 绘图动作数组，由 wx.createContext 创建的 context，调用 getActions 方法导出绘图动作数组。
       */
      actions: any[];

      /**
       * 本次绘制是否接着上一次绘制，即reserve参数为false，则在本次调用drawCanvas绘制之前native层应先清空画布再继续绘制；
       * 若reserver参数为true，则保留当前画布上的内容，本次调用drawCanvas绘制的内容覆盖在上面，默认 false
       */
      reserve?: boolean;
    }

    /**
     * 绘制画布
     */
    function drawCanvas(options: DrawCanvasOptions): void;

    interface CanvasToTempFilePathOptions extends BaseOptions<any> {

      /**
       * 画布标识，传入 <canvas/> 的 cavas-id
       */
      canvasId: string;

      x?: number;// 	0	否	指定的画布区域的左上角横坐标	>= 1.2.0
      y?: number;// 	0	否	指定的画布区域的左上角纵坐标	>= 1.2.0
      width?: number;// 	canvas宽度-x	否	指定的画布区域的宽度	>= 1.2.0
      height?: number;// 	canvas高度-y	否	指定的画布区域的高度	>= 1.2.0
      /** width*屏幕像素密度  否  输出的图片的宽度  >= 1.2.0 */
      destWidth?: number;
      destHeight?: number;// 	height*屏幕像素密度	否	输出的图片的高度	>= 1.2.0
      fileType?: string;// 	png	否	目标文件的类型	>= 1.7.0
      quality?: number;// 		是	图片的质量，目前仅对 jpg 有效。取值范围为 (0, 1]，不在范围内时当作 1.0 处理。	>= 1.7.0
    }

    /**
     * 把当前画布的内容导出生成图片，并返回文件路径
     * @param options
     * @param component 在自定义组件下，当前组件实例的this，以操作组件内 canvas 组件
     */
    function canvasToTempFilePath(
      options: CanvasToTempFilePathOptions,
      component?: object,
    ): string;

    /**
     * 收起键盘。
     */
    function hideKeyboard(): void;

    /**
     * 停止当前页面下拉刷新。
     */
    function stopPullDownRefresh(): void;

    /**
     * 开始下拉刷新，调用后触发下拉刷新动画，效果与用户手动下拉刷新一致
     * @see <a href="https://developers.weixin.qq.com/miniprogram/dev/api/pulldown.html#wxstartpulldownrefresh"> startPullDownRefresh</a>
     * @since v1.5.0
     */
    function startPullDownRefresh(options?: BaseOptions<any>): void;

    // </editor-fold>

    // ---------------------------------- 开放接口API列表 ----------------------------------
    interface LoginResult {

      /**
       * 调用结果
       */
      errMsg: string;

      /**
       * 用户允许登录后，回调内容会带上 code（有效期五分钟），开发者需要将 code 发送到开发者服务器后台，
       * 使用 `code` 换取 `session_key` api，将 code 换成 openid 和 session_key
       */
      code: string;
    }

    interface LoginOptions extends BaseOptions<LoginResult> {
      timeout?: number; // 超时时间， ms       @since v1.9.90
    }

    /**
     * 调用接口获取 **登录凭证(code)** 进而换取用户登录态信息，
     * 包括用户的**唯一标识（openid）** 及本次登录的 **会话密钥（session_key）**。**用户数据的加解密通讯**需要依赖会话密钥完成。
     * ![](https://mp.weixin.qq.com/debug/wxadoc/dev/image/api-login.jpg?t=2018626)
     * @see <a href="https://developers.weixin.qq.com/miniprogram/dev/api/api-login.html">login</a>
     */
    function login(options: LoginOptions): void;

    interface Scope {
      /**
       * 用户信息
       * - wx.getUserInfo
       */
      userInfo: boolean;

      /**
       * 地理地理位置
       * - wx.getLocation
       * - wx.chooseLocation
       */
      userLocation: boolean;

      /**
       * 通讯地址
       * - wx.chooseAddress
       */
      address: boolean;

      /**
       * 发票抬头
       * - wx.chooseInvoiceTitle
       */
      invoiceTitle: boolean;

      /**
       * 微信运动步数
       * - wx.getWeRunData
       */
      werun: boolean;

      /**
       * 录音功能
       * - wx.startRecord
       */
      record: boolean;

      /**
       * 保存到相册
       * - wx.saveImageToPhotosAlbum
       * - wx.saveVideoToPhotosAlbum
       */
      writePhotosAlbum: boolean;

      /**
       * 摄像头
       * - <camera />
       */
      camera: boolean;
    }

    interface AuthorizeOptions extends BaseOptions<any> {
      scope: string;
    }

    function authorize(options: AuthorizeOptions);

    /**
     * @param {wx.BaseOptions} options
     * @since v1.2.0
     * @see <a href="https://developers.weixin.qq.com/miniprogram/dev/api/open-api/setting/wx.getSetting.html">get setting</a>
     */
    function getSetting(options: BaseOptions<any>): void;

    type CheckSessionOptions = BaseOptions<any>;

    interface UserInfo {
      encryptedData: string;
      errMsg: string;
      iv: string;
      rawData: string;
      signature: string;
      userInfo: {
        avatarUrl: string
        city: string
        country: string
        gender: string
        language: string
        nickName: string
        province: string
      };
    }

    /**
     * 检查登陆态是否过期
     */
    function checkSession(options: CheckSessionOptions): void;

    interface GetUserInfoResult {

      /**
       * 用户信息对象，不包含 openid 等敏感信息
       */
      userInfo: IData;

      /**
       * 不包括敏感信息的原始数据字符串，用于计算签名。
       */
      rawData: string;

      /**
       * 使用 sha1( rawData + sessionkey ) 得到字符串，用于校验用户信息。
       */
      signature: string;

      /**
       * 包括敏感数据在内的完整用户信息的加密数据，详细见加密数据解密算法
       */
      encryptData: string;
    }

    interface GetUserInfoOptions extends BaseOptions<any> {

      /**
       * 接口调用成功的回调函数
       */
      success?: (res?: GetUserInfoResult) => void;
    }

    /**
     * 获取用户信息，需要先调用 wx.login 接口。
     * > 此接口有调整，使用该接口将不再出现授权弹窗
     * > 请使用 <button open-type="getUserInfo"></button> 引导用户主动进行授权操作
     * @see <a href="https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserInfo.html">get user info</a>
     */
    function getUserInfo(options: GetUserInfoOptions): void;

    interface RequestPaymentOptions extends BaseOptions<any> {

      /**
       * 时间戳从1970年1月1日00:00:00至今的秒数,即当前的时间
       */
      timeStamp: number | string;

      /**
       * 随机字符串，长度为32个字符以下。
       */
      nonceStr: string;

      /**
       * 统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=*
       */
      package: string;

      /**
       * 签名算法，暂支持 MD5
       */
      signType: string;

      /**
       * 签名,具体签名方案参见[微信公众号支付帮助文档](https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=4_3&t=1477656495417)
       */
      paySign: string;
    }

    /**
     * 发起微信支付。
     */
    function requestPayment(options: RequestPaymentOptions): void;

    function updateShareMenu(option: any);

    function showShareMenu(option: any);

    function hideShareMenu(option: any);

    function getShareInfo(option?: any);

    // <editor-fold desc="Tab Bar">
    interface TabBarOptions extends BaseOptions<any> {
      /** default: false */
      animation?: boolean;
    }

    /**
     * 隐藏 tabBar
     */
    function hideTabBar(options?: TabBarOptions): void;

    /**
     * 显示 tabBar
     */
    function showTabBar(options?: TabBarOptions): void;

    function setTabBarBadge(options): void;

    function removeTabBarBadge(options): void;

    function hideTabBarRedDot(): void;

    function showTabBarRedDot(): void;

    function setTabBarItem(): void;

    function setTabBarStyle(): void;

    // </editor-fold>

    function sceneName(scene: number);

    function createSelectorQuery();

    function pageScrollTo(param: {
      scrollTop: ((value: (number | string)) => any) | number | string
    });

    function getUpdateManager(): any;

    function openSetting();

    interface MenuButtonBounding {
      bottom: number;
      height: number;
      left: number;
      right: number;
      top: number;
      width: number;
    }

    function getMenuButtonBoundingClientRect(): MenuButtonBounding;

  }

  // </editor-fold>

  interface Target {
    id?: string;
    name?: string;
    dataset?: any;
    offsetLeft?: number;
    offsetTop?: number;
  }

  interface WXEvent {
    currentTarget?: Target;
    // target?: Target
    detail?: { value?: any } | any;
    type?: string;
  }
}
