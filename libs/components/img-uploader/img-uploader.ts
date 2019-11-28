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
import {UI} from "../../wx/UI";
import {WX} from "../../wx/WX";
import {ImgUploaderService} from "./img-uploader.service";
import {ZZ_IMG_CONFIG} from "../zz-img/config";

Component({
  data: {
    uploading: [],
  },

  options: {
    addGlobalClass: true
  },

  properties: {
    urls: {
      type: Array, value: [], observer: function (newVal) {
        if (!newVal) {
          this.setData({urls: []});
        }
        this.completeImgUrl();
      }
    },

    url: {
      type: String, value: "", observer: function (newVal) {
        if (newVal) {
          this.setData({urls: [newVal]});
          this.completeImgUrl();
        }
      }
    },

    disabled: {type: Boolean, value: false},
    /** 最大数量, 默认 9 */
    count: {type: Number, value: 9},
    /** 是否允许从相册选择 */
    cameraOnly: {type: Boolean, value: false},
    text: {type: String, value: "上传图片"},
    scope: {type: String, value: ""}
  },


  methods: {
    chooseImage()
    {
      let from = ['camera'];
      if (!this.data.cameraOnly) { from.unshift("album") }
      WX.chooseImage(this.data.count - this.data.urls.length, from)
          .flatMap(filePaths => {
            this.setData({uploading: filePaths});
            return ImgUploaderService.imageOperator.upload({images: filePaths, scope: this.data.scope})
          }) // 上传
          .subscribe(res => {
            this.data.urls.push(...res);
            this.setData({
              urls: this.data.urls,
              uploading: []
            });
            this.triggerChange();
          }, e => {
            if (typeof e == "string") UI.toastFail(e, 2000);
            this.setData({uploading: []});
          });
    },

    removeImage(event: WXEvent)
    {
      UI.confirm("是否要删除图片?").subscribe(res => {
        let deleted = this.data.urls.splice(event.currentTarget.dataset.index, 1);
        ImgUploaderService.imageOperator.remove(deleted)
            .subscribe(res => {}, e => console.error("图片删除失败", e));
        this.setData({urls: this.data.urls});
        this.triggerChange();
      });
    },

    triggerChange()
    {

      if (this.data.count == 1) {
        this.triggerEvent("change", {value: this.data.urls[0] || null})
      } else {
        this.triggerEvent("change", {value: this.data.urls})
      }
    },

    view(e: WXEvent)
    {
      let url = e.currentTarget.dataset.url;
      let urls = e.currentTarget.dataset.urls;
      wx.previewImage({
        current: url,
        urls: urls
      });
    },

    completeImgUrl()
    {
      let change = false;
      let urls = [];
      this.data.urls.forEach(url => {
        if (url.indexOf('http') != 0 && url.indexOf('/assets/') != 0 && ZZ_IMG_CONFIG.BASE_URL.indexOf("http") == 0) {
          url = ZZ_IMG_CONFIG.BASE_URL + url;
          change = true;
        }
        urls.push(url)
      });
      if (change) {
        setTimeout(() => this.setData({urls}), 200);
      }
    }
  },
});
