"use strict";
exports.__esModule = true;
var WX_1 = require("../../wx/WX");
Component({
    data: {
        x: 0,
        currentX: 0,
        width: 0,
        bodyHeight: 0,
        buttonWidth: 0,
    },
    options: { multipleSlots: true },
    relations: {
        './slider-list': {
            type: 'parent',
            linked: function (target) {
                this.parent = target;
            }
        }
    },
    methods: {
        handleMovableChange: function (e) {
            this.currentX = e.detail.x;
        },
        handleTouchEnd: function (e) {
            var threshold = this.data.buttonWidth * 0.6;
            if (this.currentX < -threshold) {
                this.setData({ x: -this.data.buttonWidth });
            }
            else {
                this.reset();
            }
        },
        reset: function () {
            this.setData({ x: 0 });
        },
        handleToucheStart: function (e) {
            this.parent.reset(this);
        }
    },
    ready: function () {
        var _this = this;
        // 容器宽度
        WX_1.WX.size("#width", this).subscribe(function (res) { return _this.setData({ width: res.width }); });
        setTimeout(function () {
            WX_1.WX.size(".body", _this).subscribe(function (res) { return _this.setData({ bodyHeight: res.height }); });
            WX_1.WX.size(".buttons", _this).subscribe(function (res) { return _this.data.buttonWidth = res.width; });
        }, 100);
    }
});
