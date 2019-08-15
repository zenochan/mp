"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Keywords_1 = require("../../utils/Keywords");
Component({
    methods: {
        //点击即触发获取formId
        catchSubmit: function (e) {
            Keywords_1.Keywords.save(e.detail.formId, "formids");
        }
    }
});
//# sourceMappingURL=formid.js.map