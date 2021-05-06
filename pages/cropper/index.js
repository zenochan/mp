"use strict";
exports.__esModule = true;
var mp_1 = require("../../libs/mp");
mp_1.HookPage({
    navTitle: "图片裁剪",
    cropper: null,
    onLoad: function () {
        this.cropper = this.selectComponent('#cropper');
        this.cropper.fnInit({
            imagePath: '/pages/cropper/test.jpg',
            debug: true,
            outputFileType: 'jpg',
            quality: 1,
            aspectRatio: 1.25,
            minBoxWidthRatio: 0.2,
            minBoxHeightRatio: 0.2,
            initialBoxWidthRatio: 0.6,
            initialBoxHeightRatio: 0.6 //可选。同initialBoxWidthRatio，当设置aspectRatio时，initialBoxHeightRatio值设置无效。initialBoxHeightRatio值由initialBoxWidthRatio 和 aspectRatio自动计算得到。
        });
    },
    ////////  cancel ///////////////////
    fnCancel: function () {
        console.log('cancel');
        //todo something
    },
    ////////// do crop ////////////////////
    fnSubmit: function () {
        console.log('submit');
        //do crop
        this.cropper.fnCrop({
            //剪裁成功的回调
            success: function (res) {
                console.log(res);
                //生成文件的临时路径
                console.log(res.tempFilePath);
                wx.previewImage({
                    urls: [res.tempFilePath]
                });
            },
            //剪裁失败的回调
            fail: function (res) {
                console.log(res);
            },
            //剪裁结束的回调
            complete: function () {
                //complete
            }
        });
    }
});
