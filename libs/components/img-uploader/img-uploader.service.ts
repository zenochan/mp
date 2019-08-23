import {Observable} from "../../rx/Observable";
import {API} from "../../service/api.service";


export interface ImageOperator
{
  upload(...images: string[]): Observable<any>

  remove(...images: string[]): Observable<any>
}

export class DefaultImageOperator implements ImageOperator
{
  upload(...images): Observable<any>
  {
    return API.uploadMore(images);
  }

  remove(...images): Observable<any>
  {
    return API.post("delete", {photos: images})
  }

}

export class ImgUploaderService
{
  static imageOperator = new DefaultImageOperator();

}
