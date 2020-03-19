"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var weapp_1 = require("../../libs/wx/weapp");
weapp_1.HookPage({
    onShareAppMessage: function () {
        return {
            title: "什么鬼啊",
            success: function (res) {
                console.error("WTF", res);
            }
        };
    },
    change: function () {
        this.zzSetData({ datas: [12, 1, 1, 1, 1, 1] });
    }
});
//# sourceMappingURL=index.js.map