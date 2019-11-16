import {Observable} from "../../rx/Observable";
import {API} from "../../service/api.service";


export interface UploadOptions
{
  images: string[]
  scope?: string
}

export interface ImageOperator
{
  upload(options: UploadOptions): Observable<any>

  remove(...images): Observable<any>
}

export class DefaultImageOperator implements ImageOperator
{
  upload(options: UploadOptions): Observable<any>
  {
    return API.uploadMore(options.images);
  }

  remove(...images): Observable<any>
  {
    return API.post("delete", {photos: images})
  }

}

export class ImgUploaderService
{
  static imageOperator: ImageOperator = new DefaultImageOperator();

}
