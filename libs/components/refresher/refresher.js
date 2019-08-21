"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
Component({
    relations: {
        "../body/body": { type: "parent" }
    },
    methods: {
        onScroll: function (e) {
            this.data.scrollTop = e.detail.scrollTop;
        },
        onScrollToUpper: function (e) {
            this.data.upper = true;
        },
        onTouchStart: function (e) {
        },
        onTouchMove: function (e) {
        },
        onTouchEnd: function (e) {
        }
    }
});
//# sourceMappingURL=refresher.js.map