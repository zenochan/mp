/**
 * # properties
 *
 * - cameraOnly 仅允许相机拍照
 * - count 最大数量，默认9
 * - text 上传按钮提示文字
 * - disabled 只读
 * - scope 存储空间（前缀）
 * - urls
 * - url
 *
 * # events
 * - change 数据改变, 当 [count == 1] 时， 携带的数据不是数组
 */
import { UI } from '../../wx/UI';
import { WX } from '../../wx/WX';
import { ImgUploaderService } from './img-uploader.service';
import { ZZ_IMG_CONFIG } from '../zz-img/config';

Component({
  data: {
    uploading: [],
    files: [],
  },

  options: {
    addGlobalClass: true,
  },

  properties: {
    urls: {
      type: Array,
      value: [],
      observer(newVal) {
        this.handleUrls(newVal);
      },
    },

    url: {
      type: String,
      value: '',
      observer(newVal) {
        if (newVal) {
          this.handleUrls([newVal]);
        } else {
          this.setData({ urls: [], files: [] });
        }
      },
    },

    /**
     * - image
     * - video
     * - media
     */
    type: {
      type: String, value: 'image',
    },

    disabled: { type: Boolean, value: false },
    /** 最大数量, 默认 9 */
    count: { type: Number, value: 9 },
    /** 是否允许从相册选择 */
    cameraOnly: { type: Boolean, value: false },
    text: { type: String, value: '上传图片' },
    scope: { type: String, value: '' },
  },

  methods: {
    chooseMedia() {
      const {
        urls, count, cameraOnly, type,
      } = this.data;

      const sourceType: ('camera' | 'album')[] = ['camera'];
      if (!cameraOnly) {
        sourceType.unshift('album');
      }

      const mediaType: ('image' | 'video')[] = {
        media: ['image', 'video'],
        image: ['image'],
        video: ['video'],
      }[type];

      WX.chooseMedia({ count: count - urls.length, sourceType, mediaType })
        .flatMap((tempFiles) => {
          const tempFilePaths = tempFiles.map((file) => file.tempFilePath);
          this.setData({ uploading: tempFiles });
          return ImgUploaderService.imageOperator.upload({ images: tempFilePaths, scope: this.data.scope });
        }) // 上传
        .subscribe((res) => {
          this.data.files.push(...this.mapUrlsToFiles(res));
          this.setData({
            files: this.data.files,
            uploading: [],
          });
          this.triggerChange();
        }, (e) => {
          if (typeof e === 'string') UI.toastFail(e, 2000);
          this.setData({ uploading: [] });
        });
    },

    removeItem(event: WXEvent) {
      UI.confirm('是否删除?').subscribe(() => {
        const deleted = this.data.files.splice(event.currentTarget.dataset.index, 1);
        this.setData({ files: this.data.files });
        this.triggerChange();

        ImgUploaderService.imageOperator.remove(deleted[0].url)
          .subscribe(() => null, (e) => console.error('删除失败', e));
      });
    },

    triggerChange() {
      const urls = this.data.files.map((file) => file.url);
      const value = this.data.count === 1 ? urls[0] || null : urls;
      this.triggerEvent('change', { value });
    },

    view(e: WXEvent) {
      const { index } = e.currentTarget.dataset;
      const current = this.data.files[index];
      if (wx.previewMedia) {
        wx.previewMedia({
          url: current.url,
          sources: this.data.files.map((file) => ({
            url: file.url,
            type: file.isImage ? 'image' : 'video',
          })),
        });
      } else if (current.isImage) {
        const urls = this.data.files.filter((file) => file.isImage).map((file) => file.url);
        wx.previewImage({ current: current.url, urls });
      } else {
        UI.toastFail('您的微信版本不支持预览视频');
      }
    },

    handleUrls(urls) {
      this.setData({ files: this.mapUrlsToFiles(urls) });
    },

    mapUrlsToFiles(urls) {
      return urls.map((url) => {
        let validUrl = url;
        const invalidUrl = !url.startsWith('http') && !url.includes('assets');
        const validBaseUrl = ZZ_IMG_CONFIG.BASE_URL.startsWith('http');
        if (invalidUrl && validBaseUrl) {
          validUrl = ZZ_IMG_CONFIG.BASE_URL + url;
        }

        return {
          url: validUrl,
          isVideo: /.(mp4|avi|flv|mov|rm|rmvb|3gp)/.test(url.toLowerCase()),
          isImage: /.(jpg|jpeg|png|gif)/.test(url.toLowerCase()),
        };
      });
    },
  },
});
