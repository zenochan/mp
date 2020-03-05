import {Events} from "../../wx/Events";

Component({
  methods: {
    catchSubmit: function (e) {
      let formId = e.detail.formId;
      if (formId != "the formId is a mock one") {
        Events.publish("formid", formId)
      } else {
        console.log(formId)
      }
    }
  }
});
