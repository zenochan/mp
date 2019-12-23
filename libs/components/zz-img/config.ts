import {WX} from "../../wx/WX";

export class ZZ_IMG_CONFIG
{
  static BASE_URL: string = "http://127.0.0.1/";
  static ratio = 2;
}

wx.getSystemInfo({
  success(res)
  {
    ZZ_IMG_CONFIG.ratio = res.pixelRatio;
  }
});
