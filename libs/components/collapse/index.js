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
    data: { expand: false, marginTop: 0 },
    methods: {
        clickHeader: function () {
            var _this = this;
            if (this.data.anim)
                return;
            this.setData({ expand: !this.data.expand, anim: true });
            WX_1.WX.queryBoundingClientRect("#body", this).subscribe(function (res) {
                var body = res[0];
                var bodyHeight = (body.bottom - body.top) || _this.data.bodyHeight;
                interceptor_1.Interceptor.easeOut(300).subscribe(function (timer) {
                    if (_this.data.expand)
                        timer = 1 - timer;
                    _this.setData({ marginTop: -bodyHeight * timer, bodyHeight: bodyHeight });
                }, null, function () { return _this.data.anim = false; });
            });
        }
    },
    attached: function () {
        var _this = this;
        this.sub = WX_1.WX.page().onDataChange.delay(200).subscribe(function (res) {
            WX_1.WX.queryBoundingClientRect("#body", _this).subscribe(function (res) {
                var body = res[0];
                var bodyHeight = body.bottom - body.top;
                if (!_this.data.expand) {
                    // 收起
                    _this.setData({ marginTop: -bodyHeight, bodyHeight: bodyHeight });
                }
            }, function (e) {
            });
        });
    },
    detached: function () {
        this.sub.unsubscribe();
    },
    ready: function () {
        var _this = this;
        WX_1.WX.queryBoundingClientRect("#body", this).subscribe(function (res) {
            var body = res[0];
            var bodyHeight = body.bottom - body.top;
            if (!_this.data.expand) {
                // 收起
                _this.setData({ marginTop: -bodyHeight, bodyHeight: bodyHeight });
            }
        });
    }
});
//# sourceMappingURL=index.js.map