/**
 * ```
 * "usingComponents": {
 *    "home": "/libs/components/home-button/home-button"
 * }
 * ```
 */
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        index: { type: String, value: "/pages/index/index" }
    },
    /**
     * 组件的初始数据
     */
    data: {
        show: false,
        offsetX: 20,
        offsetY: 20 //rpx
    },
    /**
     * 组件的方法列表
     */
    methods: {
        navIndex: function () {
            wx.reLaunch({ url: this.data.index });
        },
        onTouchStart: function (e) {
            if (e.touches.length != 1)
                return;
            var touch = e.touches[0];
            this.p = [touch.clientX, touch.clientY];
        },
        onTouchMove: function (e) {
            if (e.touches.length != 1)
                return;
            var info = wx.getSystemInfoSync();
            var ratio = info.pixelRatio * 1;
            var touch = e.touches[0];
            var p = this.p;
            this.p = [touch.clientX, touch.clientY];
            var delta = [this.p[0] - p[0], this.p[1] - p[1]];
            this.data.offsetX -= delta[0] * ratio * 1.15;
            this.data.offsetY -= delta[1] * ratio * 1.15;
            if (this.data.offsetX < 0)
                this.data.offsetX = 0;
            if (this.data.offsetY < 0)
                this.data.offsetY = 0;
            if (this.data.offsetX > info.windowWidth * ratio)
                this.data.offsetX = info.windowWidth * ratio;
            if (this.data.offsetY > info.windowHeight * ratio)
                this.data.offsetY = info.windowHeight * ratio;
            this.setData(this.data);
        },
        onTouchEnd: function (e) {
            if (e.changedTouches.length != 1)
                return;
            var touch = e.changedTouches[0];
            delete this.p;
        }
    },
    attached: function () {
        this.setData({ show: getCurrentPages().length == 1 });
    },
});
//# sourceMappingURL=home-button.js.map