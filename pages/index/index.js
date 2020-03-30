"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var weapp_1 = require("../../libs/wx/weapp");
weapp_1.HookPage({
    navTitle: "Zeno Lib",
    data: {
        menu: [
            {
                name: "功能组件",
                children: [
                    { name: "授权定位弹窗", page: "/pages/location-deny/index" }
                ]
            }
        ]
    }
});
//# sourceMappingURL=index.js.map