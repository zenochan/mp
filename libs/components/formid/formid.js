"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Events_1 = require("../../wx/Events");
Component({
    methods: {
        catchSubmit: function (e) {
            var formId = e.detail.formId;
            if (formId != "the formId is a mock one") {
                Events_1.Events.publish("formid", formId);
            }
            else {
                console.log(formId);
            }
        }
    }
});
//# sourceMappingURL=formid.js.map