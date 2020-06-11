import {WX} from "../../mp";

export class ZZ_IMG_CONFIG {
  static BASE_URL: string = "http://127.0.0.1/";
  static ratio = 2;
}

WX.systemInfo().subscribe(info => ZZ_IMG_CONFIG.ratio = info.pixelRatio);
