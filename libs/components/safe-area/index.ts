/*
 * Copyright (c) 2020. Zeno Chan.
 */

import { WX } from '../../wx/WX';

const { paddingBottom } = WX.systemInfoSync().safeArea;

// eslint-disable-next-line no-undef
Component({
  data: { paddingBottom },
});
