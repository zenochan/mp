"use strict";
/*
 * Copyright (c) 2020. Zeno Chan.
 */
exports.__esModule = true;
var WX_1 = require("../../wx/WX");
var paddingBottom = WX_1.WX.systemInfoSync().safeArea.paddingBottom;
Component({
    data: { paddingBottom: paddingBottom }
});
