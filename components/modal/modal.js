// libs/components/modal.js
/**
 * # Event
 * - bind:dismiss
 *
 * ```
 * "usingComponents": {
 *    "modal": "/libs/components/modal/modal"
 * }
 * ```
 */
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        show: {
            type: Boolean,
            value: false,
            observer: function (newVal, oldVal) {
                if (newVal == false && oldVal == true && this.data.dismissing == false) {
                    this.setData({ show: true });
                    this.dismiss();
                }
                else {
                    this.setData({ dismissing: false });
                }
            }
        }
    },
    /**
     * 组件的初始数据
     */
    data: {
        show: false,
        dismissing: false
    },
    /**
     * 组件的方法列表
     */
    methods: {
        dismiss: function (e) {
            var _this = this;
            if (this.data.dismissing)
                return;
            this.setData({ dismissing: true });
            setTimeout(function () {
                _this.setData({ show: false });
                _this.triggerEvent("dismiss");
            }, 300);
        },
        "catch": function (e) { }
    }
});
//# sourceMappingURL=modal.js.map