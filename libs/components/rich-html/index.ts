/*
 * Copyright (c) 2020. Zeno Chan.
 */

import { WxParse } from './wx-parse/wxParse';

/**
 * <rich-html src="{{html data}}"></rich-html>
 */
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    src: {
      type: String,
      value: '',
      observer(newVal, oldVal) {
        if (newVal == oldVal) return;
        WxParse.wxParse('__html', newVal, this);
      },
    },
    preview: { type: Boolean, value: true },
  },
});
