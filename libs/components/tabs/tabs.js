Component({
    properties: { flex: { type: Boolean, value: false } },
    relations: {
        'tab-item': { type: "child" }
    },
    methods: {
        scrollTo: function (target, width) {
            var scrollLeft = target.offsetLeft - this.data.screenW / 2 + width / 2;
            this.setData({ scrollLeft: scrollLeft });
        },
        active: function (target) {
            this.getRelationNodes('tab-item').forEach(function (item) { return item.active(item == target); });
        }
    },
    attached: function () {
        this.data.screenW = wx.getSystemInfoSync().windowWidth;
    },
    ready: function () {
        var first = this.getRelationNodes('tab-item')[0];
        first && first.active(true);
    }
});
//# sourceMappingURL=tabs.js.map