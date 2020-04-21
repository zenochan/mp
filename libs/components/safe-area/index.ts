/*
 * Copyright (c) 2020. Zeno Chan.
 */

import {WX} from "../../wx/WX";

let paddingBottom = WX.systemInfoSync().safeArea.paddingBottom;

Component({
  data: {paddingBottom: paddingBottom}
});
