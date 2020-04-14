"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Data_1 = require("../../wx/Data");
var h = Data_1.Data.get('__statusBarHeight__');
if (!h) {
    h = wx.getSystemInfoSync().statusBarHeight;
    Data_1.Data.set('__statusBarHeight__', h);
}
Component({
    data: { h: h },
    options: { addGlobalClass: true },
});
//# sourceMappingURL=index.js.map