"use strict";
exports.__esModule = true;
var mp_1 = require("../../mp");
var Rx_1 = require("../../rx/Rx");
function fnLog() {
    var msg = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        msg[_i] = arguments[_i];
    }
    if (debug) {
        console.log.apply(console, msg);
    }
}
//config
var debug = false; //是否启用调试，默认值为false。true：打印过程日志；false：关闭过程日志
var outputFileType = 'jpg'; //目标文件的类型。默认值为jpg，jpg：输出jpg格式图片；png：输出png格式图片
var quality = 1; //图片的质量。默认值为1，即最高质量。目前仅对 jpg 有效。取值范围为 (0, 1]，不在范围内时当作 1.0 处理。
var aspectRatio = null; //目标图片的宽高比，默认null，即不限制剪裁宽高比。aspectRatio需大于0
var stageLeft = 0;
var stageTop = 0;
var stageWidth = 0;
var stageHeight = 0;
var imageWidth = 0;
var imageHeight = 0;
var pixelRatio = 1; //todo设备像素密度//暂不使用//
var imageStageRatio = 1; //图片实际尺寸与剪裁舞台大小的比值，用于尺寸换算。
var minBoxWidth = 0;
var minBoxHeight = 0;
//initial
var minBoxWidthRatio = 0.15; //最小剪裁尺寸与原图尺寸的比率，默认0.15，即宽度最小剪裁到原图的0.15宽。
var minBoxHeightRatio = 0.15; //同minBoxWidthRatio，当设置aspectRatio时，minBoxHeight值设置无效。minBoxHeight值由minBoxWidth 和 aspectRatio自动计算得到。
var initialBoxWidthRatio = 0.6; //剪裁框初始大小比率。默认值0.6，即剪裁框默认宽度为图片宽度的0.6倍。
var initialBoxHeightRatio = 0.6; //同initialBoxWidthRatio，当设置aspectRatio时，initialBoxHeightRatio值设置无效。initialBoxHeightRatio值由initialBoxWidthRatio 和 aspectRatio自动计算得到。
//
var touchStartBoxLeft = 0;
var touchStartBoxTop = 0;
var touchStartBoxWidth = 0;
var touchStartBoxHeight = 0;
var touchStartX = 0;
var touchStartY = 0;
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
        box: { left: 0, top: 0, width: 0, height: 0 },
        canvasWidth: 0,
        canvasHeight: 0
    },
    /**
     * 组件的方法列表
     */
    methods: {
        fnInit: function (opts) {
            var _this = this;
            var imagePath = opts.imagePath;
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
            Rx_1.Observable.zip(mp_1.WX.queryBoundingClientRect('.layout', this), mp_1.WX.getImageInfo(imagePath)).subscribe(function (res) {
                var rect = res[0][0];
                var imageInfo = res[1];
                var layoutLeft = rect.left;
                var layoutTop = rect.top;
                var layoutWidth = rect.width;
                var layoutHeight = rect.height;
                imageWidth = imageInfo.width;
                imageHeight = imageInfo.height;
                var imageWH = imageWidth / imageHeight;
                var layoutWH = layoutWidth / layoutHeight;
                if (imageWH >= layoutWH) {
                    stageWidth = layoutWidth;
                    stageHeight = stageWidth / imageWH;
                    imageStageRatio = imageHeight / stageHeight;
                }
                else {
                    stageHeight = layoutHeight;
                    stageWidth = layoutHeight * imageWH;
                    imageStageRatio = imageWidth / stageWidth;
                }
                stageLeft = (layoutWidth - stageWidth) / 2;
                stageTop = (layoutHeight - stageHeight) / 2;
                minBoxWidth = stageWidth * minBoxWidthRatio;
                minBoxHeight = stageHeight * minBoxHeightRatio;
                var boxWidth = stageWidth * initialBoxWidthRatio;
                var boxHeight = stageHeight * initialBoxHeightRatio;
                if (aspectRatio) {
                    boxHeight = boxWidth / aspectRatio;
                }
                if (boxHeight > stageHeight) {
                    boxHeight = stageHeight;
                    boxWidth = boxHeight * aspectRatio;
                }
                var boxLeft = (stageWidth - boxWidth) / 2;
                var boxTop = (stageHeight - boxHeight) / 2;
                _this.setData({
                    imagePath: imagePath,
                    canvasWidth: imageWidth * pixelRatio,
                    canvasHeight: imageHeight * pixelRatio,
                    stageLeft: stageLeft,
                    stageTop: stageTop,
                    stageWidth: stageWidth,
                    stageHeight: stageHeight,
                    box: { left: boxLeft, top: boxTop, width: boxWidth, height: boxHeight }
                });
            });
        },
        //////////////////////////////////////
        fnTouchStart: function (e) {
            fnLog('start', e);
            var touch = e.touches[0];
            var pageX = touch.pageX;
            var pageY = touch.pageY;
            touchStartX = pageX;
            touchStartY = pageY;
            touchStartBoxLeft = this.data.box.left;
            touchStartBoxTop = this.data.box.top;
            touchStartBoxWidth = this.data.box.width;
            touchStartBoxHeight = this.data.box.height;
        },
        fnTouchMove: function (e) {
            fnLog('move');
            fnLog(e);
            var _self = this;
            var targetId = e.target.id;
            var touch = e.touches[0];
            var pageX = touch.pageX;
            var pageY = touch.pageY;
            var offsetX = pageX - touchStartX;
            var offsetY = pageY - touchStartY;
            if (targetId == 'box') {
                var newBoxLeft = touchStartBoxLeft + offsetX;
                var newBoxTop = touchStartBoxTop + offsetY;
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
                var box = this.data.box;
                box.left = newBoxLeft;
                box.top = newBoxTop;
                this.setData({ box: box });
            }
            else if (targetId == 'lt') {
                if (aspectRatio) {
                    offsetY = offsetX / aspectRatio;
                }
                var newBoxLeft = touchStartBoxLeft + offsetX;
                var newBoxTop = touchStartBoxTop + offsetY;
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
                var newBoxWidth = touchStartBoxWidth - (newBoxLeft - touchStartBoxLeft);
                var newBoxHeight = touchStartBoxHeight - (newBoxTop - touchStartBoxTop);
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
                this.setData({ box: { left: newBoxLeft, top: newBoxTop, width: newBoxWidth, height: newBoxHeight } });
            }
            else if (targetId == 'rt') {
                if (aspectRatio) {
                    offsetY = -offsetX / aspectRatio;
                }
                var newBoxWidth = touchStartBoxWidth + offsetX;
                if (newBoxWidth < minBoxWidth) {
                    newBoxWidth = minBoxWidth;
                }
                if (touchStartBoxLeft + newBoxWidth > stageWidth) {
                    newBoxWidth = stageWidth - touchStartBoxLeft;
                }
                var newBoxTop = touchStartBoxTop + offsetY;
                if (newBoxTop < 0) {
                    newBoxTop = 0;
                }
                if ((touchStartBoxTop + touchStartBoxHeight - newBoxTop) < minBoxHeight) {
                    newBoxTop = touchStartBoxTop + touchStartBoxHeight - minBoxHeight;
                }
                var newBoxHeight = touchStartBoxHeight - (newBoxTop - touchStartBoxTop);
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
                var box = this.data.box;
                box.top = newBoxTop;
                box.width = newBoxWidth;
                box.height = newBoxHeight;
                this.setData({ box: box });
            }
            else if (targetId == 'lb') {
                if (aspectRatio) {
                    offsetY = -offsetX / aspectRatio;
                }
                var newBoxLeft = touchStartBoxLeft + offsetX;
                if (newBoxLeft < 0) {
                    newBoxLeft = 0;
                }
                if ((touchStartBoxLeft + touchStartBoxWidth - newBoxLeft) < minBoxWidth) {
                    newBoxLeft = touchStartBoxLeft + touchStartBoxWidth - minBoxWidth;
                }
                var newBoxWidth = touchStartBoxWidth - (newBoxLeft - touchStartBoxLeft);
                var newBoxHeight = touchStartBoxHeight + offsetY;
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
                var box = this.data.box;
                box.left = newBoxLeft;
                box.width = newBoxWidth;
                box.height = newBoxHeight;
                this.setData({ box: box });
            }
            else if (targetId == 'rb') {
                if (aspectRatio) {
                    offsetY = offsetX / aspectRatio;
                }
                var newBoxWidth = touchStartBoxWidth + offsetX;
                if (newBoxWidth < minBoxWidth) {
                    newBoxWidth = minBoxWidth;
                }
                if (touchStartBoxLeft + newBoxWidth > stageWidth) {
                    newBoxWidth = stageWidth - touchStartBoxLeft;
                }
                var newBoxHeight = touchStartBoxHeight + offsetY;
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
                var box = this.data.box;
                box.width = newBoxWidth;
                box.height = newBoxHeight;
                this.setData({ box: box });
            }
        },
        fnTouchEnd: function (e) {
            fnLog('end');
        },
        fnTouchCancel: function (e) {
            fnLog('cancel');
        },
        fnCrop: function (opts) {
            var _this = this;
            var _success = function () {
            };
            var _fail = function () {
            };
            var _complete = function () {
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
            var imagePath = this.data.imagePath;
            var canvasContext = wx.createCanvasContext('canvas', this);
            var box = this.data.box;
            var sx = Math.ceil(box.left * imageStageRatio);
            var sy = Math.ceil(box.top * imageStageRatio);
            var sWidth = Math.ceil(box.width * imageStageRatio);
            var sHeight = Math.ceil(box.height * imageStageRatio);
            var dx = 0;
            var dy = 0;
            var dWidth = Math.ceil(sWidth * pixelRatio);
            var dHeight = Math.ceil(sHeight * pixelRatio);
            canvasContext.drawImage(imagePath, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
            canvasContext.draw(false, function () {
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
                }, _this);
            });
        }
    }
});
