/**
 * 微信小程序JavaScriptSDK
 *
 * @version 1.0
 * @date 2017-01-10
 * @author jaysonzhou@tencent.com
 */
import {Observable} from "../rx/Rx";
import {Events} from "../wx/Events";
import {WX} from "../mp";

var ERROR_CONF = {
  KEY_ERR: 311,
  KEY_ERR_MSG: 'key格式错误',
  PARAM_ERR: 310,
  PARAM_ERR_MSG: '请求参数信息有误',
  SYSTEM_ERR: 600,
  SYSTEM_ERR_MSG: '系统错误',
  WX_ERR_CODE: 1000,
  WX_OK_CODE: 200
};

var BASE_URL = 'https://apis.map.qq.com/ws/';
var URL_SEARCH = BASE_URL + 'place/v1/search';
var URL_SUGGESTION = BASE_URL + 'place/v1/suggestion';
var URL_GET_GEOCODER = BASE_URL + 'geocoder/v1/';
var URL_CITY_LIST = BASE_URL + 'district/v1/list';
var URL_AREA_LIST = BASE_URL + 'district/v1/getchildren';
var URL_DISTANCE = BASE_URL + 'distance/v1/';


/**
 * - {@link QQMapWX.key}
 * - {@link QQMapWX.reverseGeocoder} 逆地址解析(坐标位置描述)
 * - {@link QQMapWX.search} 地点搜索 POI
 *
 *
 * @see https://lbs.qq.com/qqmap_wx_jssdk/index.html
 */
export class QQMapWX {
  static key: string;

  /**
   * 构造函数
   *
   * @param {Object} options 接口参数,key 为必选参数
   */
  // constructor(options)
  // {
  //   if (!options.key) {
  //     throw Error('key值不能为空');
  //   }
  //   this.key = options.key;
  // }

  /**
   * POI周边检索
   *
   * @param {Object} options 接口参数对象
   *
   * 参数对象结构可以参考
   * @see https://lbs.qq.com/qqmap_wx_jssdk/method-search.html
   * @see http://lbs.qq.com/webservice_v1/guide-search.html
   */
  static search(options: SearchOptions): Observable<PoiResult[]> {
    return Observable.create(sub => {
      options.success = res => sub.next(res.data);
      options.fail = res => sub.error(res.message);
      options.complete = () => sub.complete();

      if (!Utils.checkKeyword(options)) {
        return;
      }

      var requestParam: any = {
        keyword: options.keyword,
        orderby: options.orderby || '_distance',
        page_size: options.page_size || 10,
        page_index: options.page_index || 1,
        output: 'json',
        key: this.key
      };

      if (options.address_format) {
        requestParam.address_format = options.address_format;
      }

      if (options.filter) {
        requestParam.filter = options.filter;
      }

      var distance = options.distance || "1000";
      var auto_extend = options.auto_extend || 1;

      var locationsuccess = function (result) {
        requestParam.boundary = "nearby(" + result.latitude + "," + result.longitude + "," + distance + "," + auto_extend + ")";
        wx.request(Utils.buildWxRequestConfig(options, {
          url: URL_SEARCH,
          data: requestParam
        }));
      };
      Utils.locationProcess(options, locationsuccess);

    });
  }

  /**
   * sug模糊检索
   *
   * @param {Object} options 接口参数对象
   *
   * 参数对象结构可以参考
   * http://lbs.qq.com/webservice_v1/guide-suggestion.html
   */
  static getSuggestion(options) {
    options = options || {};
    Utils.polyfillParam(options);

    if (!Utils.checkKeyword(options)) {
      return;
    }

    var requestParam = {
      keyword: options.keyword,
      region: options.region || '全国',
      region_fix: options.region_fix || 0,
      policy: options.policy || 0,
      output: 'json',
      key: this.key
    };
    wx.request(Utils.buildWxRequestConfig(options, {
      url: URL_SUGGESTION,
      data: requestParam
    }));
  }

  /**
   * 逆地址解析
   *
   * @param {Object} options 接口参数对象
   *
   * 请求参数结构可以参考
   * http://lbs.qq.com/webservice_v1/guide-gcoder.html
   */
  static reverseGeocoder(options?: ReverseGeocoderOptions): Observable<ReverseGeocoderRes> {
    options = options || {};


    let observable = Observable.create(sub => {
      options.success = res => sub.next(res.result);
      options.fail = res => sub.error(res.message);
      options.complete = res => sub.complete();
    });

    Utils.polyfillParam(options);
    var requestParam: any = {
      coord_type: options.coord_type || 5,
      get_poi: options.get_poi || 0,
      output: 'json',
      key: this.key
    };
    if (options.poi_options) {
      requestParam.poi_options = options.poi_options
    }

    var locationsuccess = result => {
      requestParam.location = result.latitude + ',' + result.longitude;
      wx.request(Utils.buildWxRequestConfig(options, {
        url: URL_GET_GEOCODER,
        data: requestParam
      }));
    };
    Utils.locationProcess(options, locationsuccess);

    return observable;
  }

  /**
   * 地址解析
   *
   * @param {Object} options 接口参数对象
   *
   * 请求参数结构可以参考
   * http://lbs.qq.com/webservice_v1/guide-geocoder.html
   */
  static geocoder(options: {
    address: string,
    region?: string,
    [key: string]: any
  }): Observable<qqmap.GeocoderRes> {
    return Observable.create(sub => {

      options.success = res => sub.next(res.result);
      options.fail = res => sub.error(res.message);
      options.complete = res => sub.complete();

      if (Utils.checkParamKeyEmpty(options, 'address')) {
        return;
      }

      var requestParam = {
        address: options.address,
        output: 'json',
        key: this.key
      };

      wx.request(Utils.buildWxRequestConfig(options, {
        url: URL_GET_GEOCODER,
        data: requestParam
      }));

    });
  }


  /**
   * 获取城市列表
   *
   * @param {Object} options 接口参数对象
   *
   * 请求参数结构可以参考
   * http://lbs.qq.com/webservice_v1/guide-region.html
   */
  static getCityList(options): Observable<any> {
    options = options || {};


    let observable = Observable.create(sub => {
      options.success = res => sub.next(res.result);
      options.fail = res => sub.error(res.message);
      options.complete = res => sub.complete();
    });

    var requestParam = {
      output: 'json',
      key: this.key
    };

    wx.request(Utils.buildWxRequestConfig(options, {
      url: URL_CITY_LIST,
      data: requestParam
    }));

    return observable;
  }

  /**
   * 获取对应城市ID的区县列表
   *
   * @param {Object} options 接口参数对象
   *
   * 请求参数结构可以参考
   * http://lbs.qq.com/webservice_v1/guide-region.html
   */
  static getDistrictByCityId(options) {
    options = options || {};
    Utils.polyfillParam(options);

    if (Utils.checkParamKeyEmpty(options, 'id')) {
      return;
    }

    var requestParam = {
      id: options.id || '',
      output: 'json',
      key: this.key
    };

    wx.request(Utils.buildWxRequestConfig(options, {
      url: URL_AREA_LIST,
      data: requestParam
    }));
  }

  /**
   * 用于单起点到多终点的路线距离(非直线距离)计算：
   * 支持两种距离计算方式：步行和驾车。
   * 起点到终点最大限制直线距离10公里。
   *
   * @param {Object} options 接口参数对象
   *
   * 请求参数结构可以参考
   * http://lbs.qq.com/webservice_v1/guide-distance.html
   */
  static calculateDistance(options) {
    options = options || {};
    Utils.polyfillParam(options);

    if (Utils.checkParamKeyEmpty(options, 'to')) {
      return;
    }

    var requestParam: any = {
      mode: options.mode || 'walking',
      to: Utils.location2query(options.to),
      output: 'json',
      key: this.key
    };

    var locationsuccess = function (result) {
      requestParam.from = result.latitude + ',' + result.longitude;
      wx.request(Utils.buildWxRequestConfig(options, {
        url: URL_DISTANCE,
        data: requestParam
      }));
    };
    if (options.from) {
      options.location = options.from;
    }

    Utils.locationProcess(options, locationsuccess);
  }
}

export interface SearchOptions {
  /**
   *POI搜索关键字
   （默认周边搜索，若需要使用指定地区名称和矩形搜索，请使用region和rectangle参数，不能同时使用）
   */
  keyword: string,

  /**
   * 默认是当前位置
   */
  location?: {
    latitude: string | number,
    longitude: string | number
  },
  /**
   * 短地址，缺省时返回长地址，可选值：'short'
   */
  address_format?: 'short' | null,
  /** 每页条目数，最大限制为20条，默认值10 */
  page_size?: number,
  /**  第x页，默认第1页 */
  age_index?: number,

  /**
   * 指定地区名称，不自动扩大范围，如北京市,（使用该功能，若涉及到行政区划，建议将auto_extend设置为0）
   * 当用户使用泛关键词搜索时（如酒店、超市），这类搜索多为了查找附近， 使用location参数，搜索结果以location坐标为中心，
   * 返回就近地点，体验更优(默认为用户当前位置坐标)
   * 不与rectangle同时使用
   *
   * > ps: 并不知道怎么传参数才能生效
   */
  region?: string | any,

  /**
   * 取值1：[默认]自动扩大范围；
   * 取值0：不扩大。 仅适用于默认周边搜索以及制定地区名称搜索。
   * 该参数适用于 jssdkv1.1    jssdkv1.2
   */
  auto_extend?: 1 | 0,

  [key: string]: any
}

export interface ReverseGeocoderOptions {
  /** 默认是当前位置 */
  location?: {
    latitude: string | number,
    longitude: string | number
  },
  /**
   * #### 输入的locations的坐标类型，可选值为[1,6]之间的整数，每个数字代表的类型说明：
   * - 1 GPS坐标
   * - 2 sogou经纬度
   * - 3 baidu经纬度
   * - 4 mapbar经纬度
   * - 5 [默认]腾讯、google、高德坐标
   * - 6 sogou墨卡托
   */
  coord_type?: 0 | 1 | 2 | 3 | 4 | 5 | 6,
  /**
   * 是否返回周边POI列表：
   * 1.返回；0不返回(默认)
   */
  get_poi?: 0 | 1,


  /**
   * 用于控制Poi列表：
   * - 1 poi_options=address_format=short
   *    返回短地址，缺省时返回长地址
   * - 2 poi_options=radius=5000
   *    半径，取值范围 1-5000（米）
   * 3 poi_options=page_size=20
   * 每页条数，取值范围 1-20
   * 4 poi_options=page_index=1
   * 页码，取值范围 1-20
   * 5 poi_options=policy=1/2/3
   * 控制返回场景，
   * policy=1[默认] 以地标+主要的路+近距离poi为主，着力描述当前位置；
   * policy=2 到家场景：筛选合适收货的poi，并会细化收货地址，精确到楼栋；
   * policy=3 出行场景：过滤掉车辆不易到达的POI(如一些景区内POI)，增加道路出路口、交叉口、大区域出入口类POI，排序会根据真实API大用户的用户点击自动优化。
   * 6 poi_options=category=分类词1,分类词2，
   * 指定分类，多关键词英文逗号分隔；
   * poi_filter=category<>分类词1,分类词2，
   * 指定不包含分类，多关键词英文逗号分隔
   * （支持类别参见：附录）
   */
  poi_options?: string

  [key: string]: any
}

export interface PoiResult {
  address: string
  location: { lat: number, lng: number }

  ad_info: {
    adcode: string | number, province: string, city: string, district: string,
    location: { lat: number, lng: number }
  }

  category: string
  id: string
  tel: string
  title: string
  type: number
  _distance: number
}

export interface ReverseGeocoderRes {
  ad_info: {
    location: { lat: any, lng: any },
    address: string,
    name: string,
    nation: string,
    nation_code: string,
    province: string,
    city: string,
    city_code: string,
    district: string,
  },

  address_component: {
    city: string
    district: string
    nation: string
    province: string
    street: string
    street_number: string
  }

  address: string,
  location: { lat: any, lng: any },
}

export class Utils {
  /**
   * 得到终点query字符串
   * @param data {Array|String} 检索数据
   */
  static location2query(data) {
    if (typeof data == 'string') {
      return data;
    }
    var query = '';
    for (var i = 0; i < data.length; i++) {
      var d = data[i];
      if (!!query) {
        query += ';';
      }
      if (d.location) {
        query = query + d.location.lat + ',' + d.location.lng;
      }
      if (d.latitude && d.longitude) {
        query = query + d.latitude + ',' + d.longitude;
      }
    }
    return query;
  }

  /**
   * 使用微信接口进行定位
   */
  static getWXLocation(success, fail, complete) {
    wx.getLocation({
      type: 'gcj02',
      isHighAccuracy: true,
      success: success,
      fail: e => {
        if (e.errMsg.indexOf("auth") > 0) {
          console.error("用户已拒绝定位授权");
          Events.publish(WX.EVENT_LOCATION_DENY, true);
        } else {
          e.errMsg = '获取定位失败，请检查微信是否有定位权限';
          fail && fail(e);
        }
      },
      complete: complete
    });
  }

  /**
   * 获取location参数
   */
  static getLocationParam(location) {
    if (typeof location == 'string') {
      const locationArr = location.split(',');
      if (locationArr.length === 2) {
        location = {
          latitude: locationArr[0],
          longitude: locationArr[1]
        };
      } else {
        location = {};
      }
    }
    return location;
  }

  /**
   * 回调函数默认处理
   */
  static polyfillParam(param) {
    param.success = param.success || function () {
    };
    param.fail = param.fail || function () {
    };
    param.complete = param.complete || function () {
    };
  }

  /**
   * 验证param对应的key值是否为空
   *
   * @param {Object} param 接口参数
   * @param {String} key 对应参数的key
   */
  static checkParamKeyEmpty(param, key) {
    if (!param[key]) {
      const errconf = this.buildErrorConfig(ERROR_CONF.PARAM_ERR, ERROR_CONF.PARAM_ERR_MSG + key + '参数格式有误');
      param.fail(errconf);
      param.complete(errconf);
      return true;
    }
    return false;
  }

  /**
   * 验证参数中是否存在检索词keyword
   *
   * @param {Object} param 接口参数
   */
  static checkKeyword(param) {
    return !this.checkParamKeyEmpty(param, 'keyword');
  }

  /**
   * 验证location值
   *
   * @param {Object} param 接口参数
   */
  static checkLocation(param) {
    var location = this.getLocationParam(param.location);
    if (!location || !location.latitude || !location.longitude) {
      var errconf = this.buildErrorConfig(ERROR_CONF.PARAM_ERR, ERROR_CONF.PARAM_ERR_MSG + ' location参数格式有误')
      param.fail(errconf);
      param.complete(errconf);
      return false;
    }
    return true;
  }

  /**
   * 构造错误数据结构
   * @param {Number} errCode 错误码
   * @param {Number} errMsg 错误描述
   */
  static buildErrorConfig(errCode, errMsg) {
    return {
      status: errCode,
      message: errMsg
    };
  }

  /**
   * 构造微信请求参数，公共属性处理
   *
   * @param {Object} param 接口参数
   * @param {Object} options 配置项
   */
  static buildWxRequestConfig(param, options) {
    var that = this;
    options.header = {"content-type": "application/json"};
    options.method = 'GET';
    options.success = function (res) {
      var data = res.data;
      if (data.status === 0) {
        param.success(data);
      } else {
        param.fail(data);
      }
    };
    options.fail = function (res) {
      res.statusCode = ERROR_CONF.WX_ERR_CODE;
      param.fail(that.buildErrorConfig(ERROR_CONF.WX_ERR_CODE, res.errMsg));
    };
    options.complete = function (res) {
      var statusCode = +res.statusCode;
      switch (statusCode) {
        case ERROR_CONF.WX_ERR_CODE: {
          param.complete(that.buildErrorConfig(ERROR_CONF.WX_ERR_CODE, res.errMsg));
          break;
        }
        case ERROR_CONF.WX_OK_CODE: {
          var data = res.data;
          if (data.status === 0) {
            param.complete(data);
          } else {
            param.complete(that.buildErrorConfig(data.status, data.message));
          }
          break;
        }
        default: {
          param.complete(that.buildErrorConfig(ERROR_CONF.SYSTEM_ERR, ERROR_CONF.SYSTEM_ERR_MSG));
        }

      }
    };
    return options;
  }

  /**
   * 处理用户参数是否传入坐标进行不同的处理
   */
  static locationProcess(param, locationsuccess, locationfail?, locationcomplete?) {
    var that = this;
    locationfail = locationfail || function (res) {
      res.statusCode = ERROR_CONF.WX_ERR_CODE;
      param.fail(that.buildErrorConfig(ERROR_CONF.WX_ERR_CODE, res.errMsg));
    };
    locationcomplete = locationcomplete || function (res) {
      if (res.statusCode == ERROR_CONF.WX_ERR_CODE) {
        param.complete(that.buildErrorConfig(ERROR_CONF.WX_ERR_CODE, res.errMsg));
      }
    };
    if (!param.location) {
      that.getWXLocation(locationsuccess, locationfail, locationcomplete);
    } else if (that.checkLocation(param)) {
      const location = Utils.getLocationParam(param.location);
      locationsuccess(location);
    }
  }
}

declare global {
  namespace qqmap {
    interface AddressComponent {
      province: string,
      city: string,
      district: string,
      street: string,
      street_number: string
    }

    interface GeocoderRes {
      ad_info: {
        /**
         * 六位数字区域代码
         */
        adcode: string | number
      }
      address_components: AddressComponent
      deviation: number
      level: number
      location: { lng: number, lat: number }
      reliability: number
      similarity: number
      title: string
    }
  }
}
