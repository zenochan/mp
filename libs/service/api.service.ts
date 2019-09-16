import UploadFileResult = wx.UploadFileResult;
import IData = wx.IData;
import {Data} from "../wx/Data";
import {Observable} from "../rx/Rx";
import {UI} from "../wx/UI";

/**
 * ## Methods
 * - {@link get}
 * - {@link post}
 * - {@link put}
 * - {@link delete}
 */
export class API
{
  static counter = 0;
  static API_BASE = "";
  static IMG_BASE = "";

  private static resHandler: Function = null;
  private static headerInterceptor: Function = null;
  private static pathInterceptor: Function = null;

  static config(config: {
    host: string,
    imgBase: string,
    resHandler?: (res, sub) => void,
    headerInterceptor?: (header: { Authorization?: string, [key: string]: any }) => IData
    pathInterceptor?: (path: string) => string
  })
  {
    this.API_BASE = config.host;
    this.IMG_BASE = config.imgBase;
    this.resHandler = config.resHandler;
    this.headerInterceptor = config.headerInterceptor;
    this.pathInterceptor = config.pathInterceptor;
  }


  static get<T>(url, query: IData = null): Observable<T | any>
  {
    url = this.query(url, query);
    url = API.pathVariable(url, query);
    return this.buildRequest({method: "GET", url: this.API_BASE + url});
  }

  static post<T>(url, param: IData = {}): Observable<any | T>
  {
    param = this.simpleImgUrl(param);
    url = API.pathVariable(url, param);
    return this.buildRequest({method: "POST", url: this.API_BASE + url, data: param});
  }

  static put<T>(url, param: string | IData = {}): Observable<T | any>
  {
    param = this.simpleImgUrl(param);
    url = API.pathVariable(url, param);
    return this.buildRequest({method: "PUT", url: this.API_BASE + url, data: param});
  }

  static delete(url): Observable<any> | any
  {
    return this.buildRequest({method: "DELETE", url: this.API_BASE + url});
  }

  static upload(filePath: string, form: { old_file?: string } = {}): Observable<UploadFileResult>
  {
    let url = this.API_BASE + "upload";
    if (this.pathInterceptor) url = this.pathInterceptor(url);

    return Observable.create(sub => {
      wx.uploadFile({
        url,
        filePath: filePath,
        header: this.tokenHeader(),
        name: "photo",
        formData: form,
        success: res => {
          let data = JSON.parse(res.data);
          this.handlerRes({statusCode: 200, data: data}, sub);
        },
        fail: e => sub.error(e),
        complete: () => sub.complete()
      })
    });
  }

  static uploadMore(filePaths: string[]): Observable<string[]>
  {

    let url = this.API_BASE + "upload";
    if (this.pathInterceptor) url = this.pathInterceptor(url);

    // 上传图片必须 https 请求，这里都直接用 prod 环境
    return Observable.create(sub => {
      let urls = [];
      let completed = 0;

      filePaths.forEach(item => {
        wx.uploadFile({
          url,
          filePath: item,
          name: "photo",
          header: this.tokenHeader(),
          success: res => urls.push(res),
          fail: e => console.error(e),
          complete: () => {
            completed++;
            if (completed == filePaths.length) {
              sub.next(this.completeImgUrl(urls));
              sub.complete();
            }
          }
        })
      });

    });
  }

  // 补全 url 连接
  static completeImgUrl(data): any
  {

    let dataString = JSON.stringify(data).replace(/"([^"]+.(png|jpg|jpeg))"/g, (reg: string, a) => {
      if (a.indexOf('http') == -1) a = this.IMG_BASE + a;
      return `"${a}"`;
    });
    return JSON.parse(dataString);
  }

  // 简化 url 连接, 上传数据时不保留图片基础链接
  static simpleImgUrl(data): any
  {
    let reg = new RegExp(this.IMG_BASE, 'g');
    let dataString = JSON.stringify(data).replace(reg, '');
    return JSON.parse(dataString);
  }

  private static requestComplete()
  {
    this.counter--;
    if (this.counter <= 0) {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }
  }

  private static handlerRes(res, sub)
  {
    if (this.resHandler) {
      this.resHandler(res, sub)
    } else {
      const data = res.data;

      if (res.statusCode < 300) {
        sub.next(this.completeImgUrl(data));
      } else if (res.statusCode == 401) {
        // 授权失败, 重启小程序
        Data.clear();
        UI.alert("登录已失效").subscribe(res => wx.reLaunch({url: "/pages/account/login/login"}));
      } else if (data.errors) {
        let err = Object.keys(data.errors).map(key => data.errors[key]).map((errorItem: []) => errorItem.join(",")).join(",");
        sub.error(err)
      } else {
        sub.error((data || {}).message || "网络请求失败")
      }
    }
  }

  private static buildRequest<T>(options: wx.RequestOptions): Observable<T>
  {
    if (this.pathInterceptor) options.url = this.pathInterceptor(options.url);
    options.header = this.tokenHeader();

    this.counter++;
    wx.showNavigationBarLoading();
    return Observable.create(sub => {
      // build callback
      options.success = res => this.handlerRes(res, sub);
      options.fail = e => sub.error("网络请求失败");
      options.complete = () => {
        sub.complete();
        this.requestComplete();
      };


      let task: any = wx.request(options);
      // 返回取消订阅的操作句柄
      return () => { task && task.abort() }
    })

  }

  private static pathVariable(url: string, param: any)
  {
    Object.keys(param || {}).forEach(key => {
      if (url.indexOf(":" + key) != -1) {
        // rest api
        url = url.replace(":" + key, param[key])
      }
    });

    return url;
  }

  private static query(url: string, param: any)
  {
    Object.keys(param || {}).forEach(key => {
      url += (url.indexOf('?') == -1 ? '?' : "&") + key + '=' + param[key]
    });

    return url;
  }

  private static tokenHeader(origin: any = {}): any
  {
    if (this.headerInterceptor) {
      return this.headerInterceptor({});
    }
  }
}
