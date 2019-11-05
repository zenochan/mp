import 'libs/utils/extends.date';
import {API} from "./libs/mp";
// import "libs/sdk/momentjs/moment.js";
wx.cloud.init();
export const db = wx.cloud.database();

//app.js
App({
  onLaunch()
  {
  }
});

API.config({
  host: 'http://localhost:8080',
  imgBase: '',
});
