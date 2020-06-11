import {WX} from "../../mp";
import {Observable} from "../../rx/Rx";

function fnLog(...msg) {
  if (debug) {
    console.log(...msg)
  }
}

//config
let debug = false;//是否启用调试，默认值为false。true：打印过程日志；false：关闭过程日志
let outputFileType = 'jpg';//目标文件的类型。默认值为jpg，jpg：输出jpg格式图片；png：输出png格式图片
let quality = 1;//图片的质量。默认值为1，即最高质量。目前仅对 jpg 有效。取值范围为 (0, 1]，不在范围内时当作 1.0 处理。
let aspectRatio = null;//目标图片的宽高比，默认null，即不限制剪裁宽高比。aspectRatio需大于0


let stageLeft = 0;
let stageTop = 0;
let stageWidth = 0;
let stageHeight = 0;

let imageWidth = 0;
let imageHeight = 0;


let pixelRatio = 1;//todo设备像素密度//暂不使用//

let imageStageRatio = 1;//图片实际尺寸与剪裁舞台大小的比值，用于尺寸换算。

let minBoxWidth = 0;
let minBoxHeight = 0;

//initial
let minBoxWidthRatio = 0.15;//最小剪裁尺寸与原图尺寸的比率，默认0.15，即宽度最小剪裁到原图的0.15宽。
let minBoxHeightRatio = 0.15;//同minBoxWidthRatio，当设置aspectRatio时，minBoxHeight值设置无效。minBoxHeight值由minBoxWidth 和 aspectRatio自动计算得到。

let initialBoxWidthRatio = 0.6;//剪裁框初始大小比率。默认值0.6，即剪裁框默认宽度为图片宽度的0.6倍。
let initialBoxHeightRatio = 0.6; //同initialBoxWidthRatio，当设置aspectRatio时，initialBoxHeightRatio值设置无效。initialBoxHeightRatio值由initialBoxWidthRatio 和 aspectRatio自动计算得到。
//


let touchStartBoxLeft = 0;
let touchStartBoxTop = 0;
let touchStartBoxWidth = 0;
let touchStartBoxHeight = 0;

let touchStartX = 0;
let touchStartY = 0;


Component({


  /**
   * 组件的初始数据
   */
  data: {
    imagePath: '',

    stageLeft: 0,
    stageTop: 0,
    stageWidth: 0,
    stageHeight: 0,

    box: {left: 0, top: 0, width: 0, height: 0},

    canvasWidth: 0,
    canvasHeight: 0

  },


  /**
   * 组件的方法列表
   */
  methods: {
    fnInit(opts) {
      let imagePath = opts.imagePath;

      if (opts.debug) {
        debug = opts.debug;
      }

      if (opts.minBoxWidthRatio) {
        minBoxWidthRatio = opts.minBoxWidthRatio;
      }

      if (opts.minBoxHeightRatio) {
        minBoxHeightRatio = opts.minBoxHeightRatio;
      }

      if (opts.initialBoxWidthRatio) {
        initialBoxWidthRatio = opts.initialBoxWidthRatio;
      }

      if (opts.initialBoxHeightRatio) {
        initialBoxHeightRatio = opts.initialBoxHeightRatio;
      }

      if (opts.aspectRatio) {
        aspectRatio = opts.aspectRatio;
      }

      Observable.zip(
        WX.queryBoundingClientRect('.layout', this),
        WX.getImageInfo(imagePath)
      ).subscribe(res => {
        let rect = res[0][0];
        let imageInfo: wx.GetImageInfoResult = res[1];

        let layoutLeft = rect.left;
        let layoutTop = rect.top;
        let layoutWidth = rect.width;
        let layoutHeight = rect.height;

        imageWidth = imageInfo.width;
        imageHeight = imageInfo.height;

        let imageWH = imageWidth / imageHeight;
        let layoutWH = layoutWidth / layoutHeight;
        if (imageWH >= layoutWH) {
          stageWidth = layoutWidth;
          stageHeight = stageWidth / imageWH;
          imageStageRatio = imageHeight / stageHeight;
        } else {
          stageHeight = layoutHeight;
          stageWidth = layoutHeight * imageWH;
          imageStageRatio = imageWidth / stageWidth;
        }
        stageLeft = (layoutWidth - stageWidth) / 2;
        stageTop = (layoutHeight - stageHeight) / 2;


        minBoxWidth = stageWidth * minBoxWidthRatio;
        minBoxHeight = stageHeight * minBoxHeightRatio;

        let boxWidth = stageWidth * initialBoxWidthRatio;
        let boxHeight = stageHeight * initialBoxHeightRatio;

        if (aspectRatio) {
          boxHeight = boxWidth / aspectRatio;
        }
        if (boxHeight > stageHeight) {
          boxHeight = stageHeight;
          boxWidth = boxHeight * aspectRatio;
        }

        let boxLeft = (stageWidth - boxWidth) / 2;
        let boxTop = (stageHeight - boxHeight) / 2;


        this.setData({
          imagePath: imagePath,
          canvasWidth: imageWidth * pixelRatio,
          canvasHeight: imageHeight * pixelRatio,

          stageLeft: stageLeft,
          stageTop: stageTop,
          stageWidth: stageWidth,
          stageHeight: stageHeight,
          box: {left: boxLeft, top: boxTop, width: boxWidth, height: boxHeight}
        })
      })


    },


    //////////////////////////////////////
    fnTouchStart(e) {
      fnLog('start', e)

      let touch = e.touches[0];
      let pageX = touch.pageX;
      let pageY = touch.pageY;

      touchStartX = pageX;
      touchStartY = pageY;

      touchStartBoxLeft = this.data.box.left;
      touchStartBoxTop = this.data.box.top;
      touchStartBoxWidth = this.data.box.width;
      touchStartBoxHeight = this.data.box.height;


    },

    fnTouchMove: function (e) {
      fnLog('move')
      fnLog(e)
      let _self = this;

      let targetId = e.target.id;
      let touch = e.touches[0];
      let pageX = touch.pageX;
      let pageY = touch.pageY;

      let offsetX = pageX - touchStartX;
      let offsetY = pageY - touchStartY;


      if (targetId == 'box') {
        let newBoxLeft = touchStartBoxLeft + offsetX;
        let newBoxTop = touchStartBoxTop + offsetY;

        if (newBoxLeft < 0) {
          newBoxLeft = 0;
        }
        if (newBoxTop < 0) {
          newBoxTop = 0;
        }
        if (newBoxLeft + touchStartBoxWidth > stageWidth) {
          newBoxLeft = stageWidth - touchStartBoxWidth;
        }
        if (newBoxTop + touchStartBoxHeight > stageHeight) {
          newBoxTop = stageHeight - touchStartBoxHeight;
        }


        let box = this.data.box;
        box.left = newBoxLeft;
        box.top = newBoxTop;
        this.setData({box});
      } else if (targetId == 'lt') {

        if (aspectRatio) {
          offsetY = offsetX / aspectRatio
        }

        let newBoxLeft = touchStartBoxLeft + offsetX;
        let newBoxTop = touchStartBoxTop + offsetY;

        if (newBoxLeft < 0) {
          newBoxLeft = 0;
        }
        if (newBoxTop < 0) {
          newBoxTop = 0;
        }

        if ((touchStartBoxLeft + touchStartBoxWidth - newBoxLeft) < minBoxWidth) {
          newBoxLeft = touchStartBoxLeft + touchStartBoxWidth - minBoxWidth;
        }
        if ((touchStartBoxTop + touchStartBoxHeight - newBoxTop) < minBoxHeight) {
          newBoxTop = touchStartBoxTop + touchStartBoxHeight - minBoxHeight;
        }

        let newBoxWidth = touchStartBoxWidth - (newBoxLeft - touchStartBoxLeft);
        let newBoxHeight = touchStartBoxHeight - (newBoxTop - touchStartBoxTop);


        //约束比例
        if (newBoxTop == 0 && aspectRatio && newBoxLeft != 0) {
          newBoxWidth = newBoxHeight * aspectRatio;
          newBoxLeft = touchStartBoxWidth - newBoxWidth + touchStartBoxLeft;
        }
        if (newBoxLeft == 0 && aspectRatio) {
          newBoxHeight = newBoxWidth / aspectRatio;
          newBoxTop = touchStartBoxHeight - newBoxHeight + touchStartBoxTop;
        }

        if (newBoxWidth == minBoxWidth && aspectRatio) {
          newBoxHeight = newBoxWidth / aspectRatio;
          newBoxTop = touchStartBoxHeight - newBoxHeight + touchStartBoxTop;
        }

        this.setData({box: {left: newBoxLeft, top: newBoxTop, width: newBoxWidth, height: newBoxHeight}})

      } else if (targetId == 'rt') {

        if (aspectRatio) {
          offsetY = -offsetX / aspectRatio
        }


        let newBoxWidth = touchStartBoxWidth + offsetX;
        if (newBoxWidth < minBoxWidth) {
          newBoxWidth = minBoxWidth;
        }
        if (touchStartBoxLeft + newBoxWidth > stageWidth) {
          newBoxWidth = stageWidth - touchStartBoxLeft;
        }


        let newBoxTop = touchStartBoxTop + offsetY;

        if (newBoxTop < 0) {
          newBoxTop = 0;
        }

        if ((touchStartBoxTop + touchStartBoxHeight - newBoxTop) < minBoxHeight) {
          newBoxTop = touchStartBoxTop + touchStartBoxHeight - minBoxHeight;
        }
        let newBoxHeight = touchStartBoxHeight - (newBoxTop - touchStartBoxTop);


        //约束比例
        if (newBoxTop == 0 && aspectRatio && newBoxWidth != stageWidth - touchStartBoxLeft) {
          newBoxWidth = newBoxHeight * aspectRatio;
        }

        if (newBoxWidth == stageWidth - touchStartBoxLeft && aspectRatio) {
          newBoxHeight = newBoxWidth / aspectRatio;
          newBoxTop = touchStartBoxHeight - newBoxHeight + touchStartBoxTop;
        }

        if (newBoxWidth == minBoxWidth && aspectRatio) {
          newBoxHeight = newBoxWidth / aspectRatio;
          newBoxTop = touchStartBoxHeight - newBoxHeight + touchStartBoxTop;
        }


        let box = this.data.box;
        box.top = newBoxTop;
        box.width = newBoxWidth;
        box.height = newBoxHeight;
        this.setData({box});

      } else if (targetId == 'lb') {

        if (aspectRatio) {
          offsetY = -offsetX / aspectRatio
        }
        let newBoxLeft = touchStartBoxLeft + offsetX;

        if (newBoxLeft < 0) {
          newBoxLeft = 0;
        }
        if ((touchStartBoxLeft + touchStartBoxWidth - newBoxLeft) < minBoxWidth) {
          newBoxLeft = touchStartBoxLeft + touchStartBoxWidth - minBoxWidth;
        }

        let newBoxWidth = touchStartBoxWidth - (newBoxLeft - touchStartBoxLeft);


        let newBoxHeight = touchStartBoxHeight + offsetY;
        if (newBoxHeight < minBoxHeight) {
          newBoxHeight = minBoxHeight;
        }
        if (touchStartBoxTop + newBoxHeight > stageHeight) {
          newBoxHeight = stageHeight - touchStartBoxTop;
        }

        //约束比例
        if (newBoxHeight == stageHeight - touchStartBoxTop && aspectRatio && newBoxLeft != 0) {
          newBoxWidth = newBoxHeight * aspectRatio;
          newBoxLeft = touchStartBoxWidth - newBoxWidth + touchStartBoxLeft;
        }
        if (newBoxLeft == 0 && aspectRatio) {
          newBoxHeight = newBoxWidth / aspectRatio;
        }

        if (newBoxWidth == minBoxWidth && aspectRatio) {
          newBoxHeight = newBoxWidth / aspectRatio;
        }

        let box = this.data.box;
        box.left = newBoxLeft;
        box.width = newBoxWidth;
        box.height = newBoxHeight;

        this.setData({box});

      } else if (targetId == 'rb') {
        if (aspectRatio) {
          offsetY = offsetX / aspectRatio
        }
        let newBoxWidth = touchStartBoxWidth + offsetX;
        if (newBoxWidth < minBoxWidth) {
          newBoxWidth = minBoxWidth;
        }
        if (touchStartBoxLeft + newBoxWidth > stageWidth) {
          newBoxWidth = stageWidth - touchStartBoxLeft;
        }

        let newBoxHeight = touchStartBoxHeight + offsetY;
        if (newBoxHeight < minBoxHeight) {
          newBoxHeight = minBoxHeight;
        }
        if (touchStartBoxTop + newBoxHeight > stageHeight) {
          newBoxHeight = stageHeight - touchStartBoxTop;
        }


        //约束比例
        if (newBoxHeight == stageHeight - touchStartBoxTop && aspectRatio && newBoxWidth != stageWidth - touchStartBoxLeft) {
          newBoxWidth = newBoxHeight * aspectRatio;
        }

        if (newBoxWidth == stageWidth - touchStartBoxLeft && aspectRatio) {
          newBoxHeight = newBoxWidth / aspectRatio;
        }

        if (newBoxWidth == minBoxWidth && aspectRatio) {
          newBoxHeight = newBoxWidth / aspectRatio;
        }

        let box = this.data.box;
        box.width = newBoxWidth;
        box.height = newBoxHeight;

        this.setData({box});
      }


    },

    fnTouchEnd: function (e) {
      fnLog('end')
    },

    fnTouchCancel: function (e) {
      fnLog('cancel')
    },


    fnCrop(opts) {


      let _success = function () {
      };
      let _fail = function () {
      };
      let _complete = function () {
      };

      if (opts.success != null) {
        _success = opts.success;
      }
      if (opts.fail != null) {
        _fail = opts.fail;
      }
      if (opts.complete != null) {
        _complete = opts.complete;
      }


      let imagePath = this.data.imagePath;
      let canvasContext = wx.createCanvasContext('canvas', this);


      let box = this.data.box;

      let sx = Math.ceil(box.left * imageStageRatio);
      let sy = Math.ceil(box.top * imageStageRatio);

      let sWidth = Math.ceil(box.width * imageStageRatio);
      let sHeight = Math.ceil(box.height * imageStageRatio);
      let dx = 0;
      let dy = 0;


      let dWidth = Math.ceil(sWidth * pixelRatio);
      let dHeight = Math.ceil(sHeight * pixelRatio);


      canvasContext.drawImage(imagePath, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
      canvasContext.draw(false, () => {
        wx.canvasToTempFilePath({
          x: dx,
          y: dy,
          width: dWidth,
          height: dHeight,
          destWidth: sWidth,
          destHeight: sHeight,
          canvasId: 'canvas',
          fileType: outputFileType,
          quality: quality,
          success: _success,
          fail: _fail,
          complete: _complete
        }, this);

      })
    }
  }
})
