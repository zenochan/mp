import {HookPage} from "../../libs/wx/weapp";
import {DbService} from "../../service/db.service";

HookPage({
  navTitle: '加分',
  data: {
    date: new Date().format('yyyy.MM.dd'),
    score: [
      {name: '减脂打卡', score: 20, count: 0},
      {name: '语音打卡', score: 30, count: 0},
      {name: '原创素材', score: 30, count: 0},
      {name: '出货(盒)', score: 10, count: 0},
      {name: '授权(元)', score: 0.01, count: 0},
    ]
  },

  onShow()
  {
    DbService.injectUsers(this)
  },

  activeUser(e: WXEvent)
  {
    let userActive = e.currentTarget.dataset.user.wechat;
    this.setData({userActive});
  },

  input(e: WXEvent)
  {
    let value = e.detail.value;
    let index = e.currentTarget.dataset.index;
    this.data.score[index].count = value;
    this.setData({score: this.data.score});
  },

  plus(e: WXEvent)
  {
    let index = e.currentTarget.dataset.index;
    this.data.score[index].count++;
    this.setData({score: this.data.score});
  },

  minus(e: WXEvent)
  {
    let index = e.currentTarget.dataset.index;
    this.data.score[index].count--;
    this.setData({score: this.data.score});
  }

});
