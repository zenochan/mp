"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WX_1 = require("../../wx/WX");
Component({
    properties: {
        flex: { type: Boolean, value: false },
        name: { type: String, value: 'tab' },
        active: {
            type: Number, value: 0, observer: function () {
                this.active(this.data.active);
            }
        }
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
            if (typeof target == 'number') {
                target = items[target];
            }
            if (!target)
                return;
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
        this.page = WX_1.WX.page();
    }
});
//# sourceMappingURL=tabs.js.map