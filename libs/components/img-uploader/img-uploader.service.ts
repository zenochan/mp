import { Observable } from '../../rx/Rx';
import { API } from '../../mp';

export interface UploadOptions {
  images: string[]
  scope?: string
}

export interface ImageOperator {
  upload(options: UploadOptions): Observable<any>

  remove(...images): Observable<any>
}

export class DefaultImageOperator implements ImageOperator {
  // eslint-disable-next-line class-methods-use-this
  upload(options: UploadOptions): Observable<any> {
    return API.uploadMore({ filePaths: options.images });
  }

  // eslint-disable-next-line class-methods-use-this
  remove(...images): Observable<any> {
    return API.post('delete', { photos: images });
  }
}

export class ImgUploaderService {
  static imageOperator: ImageOperator = new DefaultImageOperator();
}
