Component({
    properties: {
        flex: { type: Boolean, value: false },
        name: { type: String, value: 'tab' },
        active: { type: Number, value: 0 }
    },
    options: {
        addGlobalClass: true
    },
    relations: {
        'tab-item': { type: "child" }
    },
    methods: {
        scrollTo: function (target, width) {
            var scrollLeft = target.offsetLeft - this.data.screenW / 2 + width / 2;
            this.setData({ scrollLeft: scrollLeft });
        },
        active: function (target) {
            var items = this.getRelationNodes('tab-item');
            var active = 0;
            items.forEach(function (item, index) {
                item.active(item == target);
                if (item == target)
                    active = index;
            });
            this.data.active = active;
            this.triggerEvent('change', { active: active, data: target.dataset });
            var data = {};
            data[this.data.name] = active;
            this.page.setData(data);
        }
    },
    attached: function () {
        this.data.screenW = wx.getSystemInfoSync().windowWidth;
        var pages = getCurrentPages();
        this.page = pages[pages.length - 1];
    },
    ready: function () {
        var active = this.getRelationNodes('tab-item')[this.data.active];
        active && active.active(true);
    }
});
//# sourceMappingURL=tabs.js.map