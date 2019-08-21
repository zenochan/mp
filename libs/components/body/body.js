"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @see https://www.jianshu.com/p/f096a47dbf6f
 */
Component({
    data: {},
    /**
     * 组件的属性列表
     */
    properties: {
        pullText: {
            type: String,
            value: '下拉可以刷新',
        },
        releaseText: {
            type: String,
            value: '松开立即刷新',
        },
        loadingText: {
            type: String,
            value: '正在刷新数据中',
        },
        finishText: {
            type: String,
            value: '刷新完成',
        },
        pullDownHeight: {
            type: Number,
            value: 60,
        },
    },
    relations: {
        '../zpage/zpage': {
            type: "parent",
            linked: function (target) {
                this.parent = target;
            }
        },
        "../refresher/refresher": {
            type: "child",
            linked: function (target) {
                this.refresher = target;
            }
        }
    },
    methods: {
        onScroll: function (e) { this.refresher && this.refresher.onScroll(e); },
        onScrollToUpper: function (e) { this.refresher && this.refresher.onScrollToUpper(e); },
        onTouchStart: function (e) { this.refresher && this.refresher.onTouchStart(e); },
        onTouchMove: function (e) { this.refresher && this.refresher.onTouchMove(e); },
        onTouchEnd: function (e) { this.refresher && this.refresher.onTouchEnd(e); }
    },
});
//# sourceMappingURL=body.js.map