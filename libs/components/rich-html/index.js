"use strict";
/*
 * Copyright (c) 2020. Zeno Chan.
 */
exports.__esModule = true;
var wxParse_1 = require("./wx-parse/wxParse");
/**
 * <rich-html src="{{html data}}"></rich-html>
 */
Component({
    options: {
        addGlobalClass: true
    },
    properties: {
        src: {
            type: String,
            value: '',
            observer: function (newVal, oldVal) {
                if (newVal == oldVal)
                    return;
                wxParse_1.WxParse.wxParse('__html', newVal, this);
            }
        },
        preview: { type: Boolean, value: true }
    }
});
