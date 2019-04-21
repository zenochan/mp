"use strict";
exports.__esModule = true;
exports.HOOK_CONF = { log: true };
exports.PageInjectors = [];
/**
 * @version 20190328
 * @param page
 * @author Zeno (zenochan@qq.com)
 */
function hookInputEvent(page) {
    var originToggle = page.toggle;
    page['toggle'] = function (e) {
        var id = e.currentTarget.id;
        if (id) {
            var data = {};
            data[id] = !this.data[id];
            this.setData(data);
        }
        originToggle && originToggle.apply(this, arguments);
    };
    page.clear = function (e) {
        var id = e.currentTarget.dataset.name;
        if (id) {
            var rootData = {};
            var node = rootData;
            var fields = id.split(".");
            if (fields.length > 1) {
                node = this.data[fields[0]] || {};
                rootData[fields[0]] = node;
                // 去头去尾取节点
                for (var i = 1; i < fields.length - 1; i++) {
                    node = node[fields[i]];
                }
            }
            node[fields[fields.length - 1]] = null;
            this.setData(rootData);
        }
    };
    page.clearFocus = function (e) {
        var _this = this;
        this.setData({
            focus: null,
            hideKeyboard: true
        });
        setTimeout(function () {
            _this.setData({ hideKeyboard: false });
        }, 200);
    };
}
//# sourceMappingURL=weapp.js.map