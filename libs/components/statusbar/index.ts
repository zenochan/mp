import {Data} from "../../wx/Data";

let h = Data.get('__statusBarHeight__')
if (!h) {
  h = wx.getSystemInfoSync().statusBarHeight;
  Data.set('__statusBarHeight__', h);
}

Component({
  data: {h},
  options: {addGlobalClass: true},
});
