"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * <collapse>
 *   <view slot="header">header</view>
 *   <view slot="body" class="body" style="height: 20vh;background: orange">body</view>
 * </collapse>
 */
var WX_1 = require("../../wx/WX");
var interceptor_1 = require("../../utils/interceptor");
Component({
    options: {
        multipleSlots: true,
        addGlobalClass: true
    },
    properties: {
        expand: { type: "boolean", value: false }
    },
    data: {
        expand: false,
        marginTop: 0,
    },
    methods: {
        clickHeader: function () {
            var _this = this;
            if (this.data.anim)
                return;
            this.calcHeight(function () {
                _this.setData({ expand: !_this.data.expand, anim: true });
                var bodyHeight = _this.data.bodyHeight;
                interceptor_1.Interceptor.easeOut(300).subscribe(function (timer) {
                    if (_this.data.expand)
                        timer = 1 - timer;
                    _this.setData({ marginTop: -bodyHeight * timer, bodyHeight: bodyHeight });
                }, null, function () { return _this.data.anim = false; });
            });
        },
        calcHeight: function (next) {
            var _this = this;
            this.setData({ ready: this.data.expand });
            WX_1.WX.queryBoundingClientRect(".body", this).subscribe(function (res) {
                var body = res[0];
                var bodyHeight = body.bottom - body.top;
                _this.setData({
                    marginTop: _this.data.expand ? 0 : -bodyHeight,
                    bodyHeight: bodyHeight,
                    ready: true
                });
                next && next();
            });
        }
    },
    attached: function () {
        var _this = this;
        this.sub = WX_1.WX.page().onDataChange
            .delay(200)
            .subscribe(function (res) { return _this.calcHeight(); });
    },
    ready: function () {
        this.calcHeight();
    },
    detached: function () {
        this.sub.unsubscribe();
    },
});
//# sourceMappingURL=index.js.map