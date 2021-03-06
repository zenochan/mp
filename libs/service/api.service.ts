import { Data } from '../wx/Data';
import { Observable } from '../rx/Rx';
import { UI } from '../wx/UI';
import RequestOption = WechatMiniprogram.RequestOption;

export interface Res {
  statusCode: number;
  data: any;
  header?: { [key: string]: string };
  cookies?: [];
}

/**
 * ## Methods
 * - {@link get}
 * - {@link post}
 * - {@link put}
 * - {@link patch}
 * - {@link delete}
 */
export class API {
  static counter = 0;
  static API_BASE = '';
  static IMG_BASE = '';

  static resHandler: (res: Res, sub) => void = null;
  static headerInterceptor: (header: { Authorization?: string, [key: string]: any }) => wx.IData = null;
  /**
   * @deprecated use {@link optionsInterceptor} instead
   */
  static pathInterceptor: (path: string, data?: any) => string = null;
  private static optionsInterceptor?: (options: RequestOption) => RequestOption = null;

  static config(config: {
    host: string,
    imgBase: string,
    resHandler?: (res: Res, sub) => void,
    headerInterceptor?: (header: { Authorization?: string, [key: string]: any }) => wx.IData
    optionsInterceptor?: (options: RequestOption) => RequestOption
    /**
     * @deprecated use {@link optionsInterceptor} instead
     */
    pathInterceptor?: (path: string, data: any) => string
  }) {
    this.API_BASE = config.host;
    this.IMG_BASE = config.imgBase;
    this.resHandler = config.resHandler;
    this.headerInterceptor = config.headerInterceptor;
    this.pathInterceptor = config.pathInterceptor;
    this.optionsInterceptor = config.optionsInterceptor;
  }


  static get<T>(url, query: wx.IData = null): Observable<T | any> {
    url = this.query(url, query);
    url = API.pathVariable(url, query);
    return this.buildRequest({ method: 'GET', url });
  }

  static post<T>(url, param: wx.IData = {}): Observable<any | T> {
    param = this.simpleImgUrl(param);
    url = API.pathVariable(url, param);
    return this.buildRequest({ method: 'POST', url, data: param });
  }

  static put<T>(url, param: string | wx.IData = {}): Observable<T | any> {
    param = this.simpleImgUrl(param);
    url = API.pathVariable(url, param);
    return this.buildRequest({ method: 'PUT', url, data: param });
  }

  static patch<T>(url, param: string | wx.IData = {}): Observable<T | any> {
    if (typeof param === 'object') {
      param._method = 'PATCH';
    }
    param = this.simpleImgUrl(param);
    url = API.pathVariable(url, param);
    return this.buildRequest({ method: 'POST', url, data: param });
  }

  static delete(url): Observable<any> | any {
    return this.buildRequest({ method: 'DELETE', url });
  }

  static upload(filePath: string, form: { old_file?: string } = {}): Observable<wx.UploadFileResult> {
    let url = this.API_BASE + 'upload';

    let options: any = {
      url,
      filePath,
      header: this.tokenHeader(),
      name: 'photo',
      formData: form,
    };

    if (this.pathInterceptor) {
      options.url = this.pathInterceptor(options.url);
    }

    if (this.optionsInterceptor) {
      options = this.optionsInterceptor(options);
    }

    return Observable.create(sub => {
      wx.uploadFile({
        ...options,
        success: res => {
          const data = JSON.parse(res.data);
          this.handlerRes({ statusCode: 200, data }, sub);
        },
        fail: e => sub.error(e),
        complete: () => sub.complete(),
      });
    });
  }

  static uploadMore(options: {
    filePaths: string[],
    path?: string,
    formData?: object
  }): Observable<string[]> {
    let url = this.API_BASE + (options.path || 'upload');
    if (this.pathInterceptor) {
      url = this.pathInterceptor(url);
    }

    // 上传图片必须 https 请求，这里都直接用 prod 环境
    return Observable.create(sub => {
      const urls = [];
      let completed = 0;

      options.filePaths.forEach(item => {
        wx.uploadFile({
          url,
          filePath: item,
          name: 'photo',
          formData: options.formData,
          header: this.tokenHeader(),
          success: res => {
            const data = JSON.parse(res.data);
            urls.push(data);
          },
          fail: e => console.error(e),
          complete: () => {
            completed++;
            if (completed === options.filePaths.length) {
              sub.next(this.completeImgUrl(urls));
              sub.complete();
            }
          },
        });
      });

    });
  }

  // 补全 url 连接
  static completeImgUrl(data): any {

    const dataString = JSON.stringify(data).replace(/"([^"]+.(png|jpg|jpeg))"/g, (reg: string, a) => {
      if (a.indexOf('http') === -1) {
        a = this.IMG_BASE + a;
      }
      return `"${a}"`;
    });
    return JSON.parse(dataString);
  }

  // 简化 url 连接, 上传数据时不保留图片基础链接
  static simpleImgUrl(data): any {
    const reg = new RegExp(this.IMG_BASE, 'g');
    const dataString = JSON.stringify(data).replace(reg, '');
    return JSON.parse(dataString);
  }

  private static requestComplete() {
    this.counter--;
    if (this.counter <= 0) {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }
  }

  private static handlerRes(res, sub) {
    if (this.resHandler) {
      this.resHandler(res, sub);
    } else {
      const data = res.data;
      if (res.statusCode < 300) {
        sub.next(data);
      } else if (res.statusCode === 401) {
        // 授权失败, 重启小程序
        Data.clear();
        UI.alert('登录已失效').subscribe(_ => wx.reLaunch({ url: '/pages/account/login/login' }));
      } else if (res.statusCode === 404) {
        sub.error('数据不存在或已失效');
      } else if (data.errors) {
        const err = Object.keys(data.errors).map(key => data.errors[key]).map((errorItem: []) => errorItem.join(',')).join(',');
        sub.error(err);
      } else {
        sub.error((data || {}).message || '网络请求失败');
      }
    }
  }

  private static buildRequest<T>(options: wx.RequestOptions): Observable<T> {
    if (options.url.indexOf('http') !== 0) {
      options.url = this.API_BASE + options.url;
    }

    if (options.data) {
      options.data = JSON.stringify(options.data);
    } else {
      options.data = '';
    }

    if (this.pathInterceptor) {
      options.url = this.pathInterceptor(options.url, options.data);
    }

    if (this.optionsInterceptor) {
      options = this.optionsInterceptor(options);
    }

    options.header = this.tokenHeader();

    this.counter++;
    wx.showNavigationBarLoading();
    return Observable.create(sub => {
      // build callback
      options.success = res => this.handlerRes(res, sub);
      options.fail = e => sub.error('网络请求失败');
      options.complete = () => {
        sub.complete();
        this.requestComplete();
      };


      const task: any = wx.request(options);
      // 返回取消订阅的操作句柄
      return () => {
        task && task.abort();
      };
    });

  }

  private static pathVariable(url: string, param: any) {
    Object.keys(param || {}).forEach(key => {
      if (url.indexOf(':' + key) !== -1) {
        // rest api
        url = url.replace(':' + key, param[key]);
      }
    });

    return url;
  }

  private static query(url: string, param: any) {
    Object.keys(param || {}).forEach(key => {
      const value = param[key];
      if (value != null && typeof value !== 'undefined') {
        url += (url.indexOf('?') === -1 ? '?' : '&') + key + '=' + value;
      }
    });

    return url;
  }

  private static tokenHeader(origin: any = {}): any {
    if (this.headerInterceptor) {
      return this.headerInterceptor({});
    }
  }
}
