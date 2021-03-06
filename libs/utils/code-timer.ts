import {Events} from "../wx/Events";

export class CodeTimer
{
  wait: number = 0;
  timer: number = null;

  /**
   *
   * @param type
   * @param during 等待间隔(s)，默认60
   */
  constructor(public  type: string = "code", private during: number = 60)
  {
    this.init();
  }

  init()
  {
    let wait = wx.getStorageSync(this.key());

    if (!wait) return;
    let remain = (wait - new Date().getTime()) / 1000 | 0;
    if (remain > 0) {
      this.wait = remain;
      this.intoWait();
    }
  }

  // 进入等待
  intoWait()
  {
    if (this.wait == 0) {
      this.wait = this.during;
    }
    Events.publish(this.key(), this);

    clearInterval(this.timer);
    this.timer = setTimeout(() => {
      this.wait--;
      if (this.wait > 0) {
        this.intoWait();
      } else {
        Events.publish(this.key(), this)
      }
    }, 1000)
  }

  /**
   * 在 ionWillUnload 方法中调用
   */
  saveStatus()
  {
    wx.setStorageSync(this.key(), Date.now() + this.wait * 1000);
    clearTimeout(this.timer)
  }

  key(): string
  {
    return `code:wait:${this.type}`
  }
}

export function enableTimer(page: IPage, codeType: string = "code", during: number = 60)
{

  page.zzLife().subscribe(event => {
    switch (event) {
      case "onLoad":
        page.setData({timer: new CodeTimer(codeType, during)});
        Events.subscribe(page.data.timer.key(), () => {
          page.setData({timer: page.data.timer});
        });
        break;
      case "onHide":
        page.data.timer.saveStatus();
        break;
      case "onShow":
        page.data.timer.init();
        break;
    }
  });
}
