declare global
{
  interface Date
  {
    weekOfYear: Function;
    format: Function;
    addDay: Function;
    ONE_DAY: number;
  }

  interface String
  {
    /**
     * @param fmt "yyyy-MM-dd HH:mm:ss EE"
     */
    dateFormat: Function
  }
}


Date.prototype.ONE_DAY = 86400000;

// 周次
Date.prototype.weekOfYear = function () {
  let year = this.getFullYear();
  let d = new Date(this);
  d.setHours(0, 0, 0, 0);

  // 当年的第一天
  let yearStart = new Date(year, 0, 1);
  // 修正第一天周数的偏移量
  d.setDate(d.getDate() + yearStart.getDay());

  let deltaDay = (d.getTime() - yearStart.getTime()) / this.ONE_DAY + 1;
  let weekNo = Math.ceil(deltaDay / 7);

  return [year, weekNo];
};

Date.prototype.format = function (fmt: string) { //author: meizz
  let o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
    "H+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  //年
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  //星期
  if (/(E+)/.test(fmt)) {
    let week = {
      "0": "\u65e5",
      "1": "\u4e00",
      "2": "\u4e8c",
      "3": "\u4e09",
      "4": "\u56db",
      "5": "\u4e94",
      "6": "\u516d"
    };
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[this.getDay() + ""]);
  }
  for (let k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
};

Date.prototype.addDay = function (days: number) {
  this.setTime(this.getTime() + this.ONE_DAY * days);
  return this;
};

export function now(format?: string)
{
  return new Date().format(format || "yyyy/MM/dd HH:mm:ss")
}

String.prototype.dateFormat = function (fmt: string = "yyyy-MM-dd") {
  return new Date(this.replace(/-/g, '/')).format(fmt)
};
