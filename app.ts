import 'libs/utils/extends.date';
import { API } from './libs/mp';

wx.cloud.init();
export const db = wx.cloud.database();

// app.js
App({
  onLaunch() {
  },
  onShow() {
  },
});

API.config({
  host: 'http://localhost:8080',
  imgBase: '',
});
