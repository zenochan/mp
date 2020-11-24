"use strict";
/*
 * Copyright (c) 2020. Zeno Chan.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var WX_1 = require("../../wx/WX");
var paddingBottom = WX_1.WX.systemInfoSync().safeArea.paddingBottom;
// eslint-disable-next-line no-undef
Component({
    data: { paddingBottom: paddingBottom },
});
//# sourceMappingURL=index.js.map