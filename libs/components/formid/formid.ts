import {Keywords} from "../../utils/Keywords";

Component({
  methods: {
    //点击即触发获取formId
    catchSubmit: function (e) {
      Keywords.save(e.detail.formId, "formids");
    }
  }
});
