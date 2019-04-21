import {WX} from "../../libs/wx/WX";

Component({
  externalClasses: ["zclass"],
  ready()
  {
    WX.queryBoundingClientRect(".fixed", this).subscribe(res => {
      let body = res[0];
      let bodyHeight = (body.bottom - body.top) || this.data.bodyHeight;
      console.log(bodyHeight);
      this.setData({bodyHeight});
    })
  }
});
