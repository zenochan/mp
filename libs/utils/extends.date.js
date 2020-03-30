"use strict";
exports.__esModule = true;
Date.prototype.ONE_DAY = 86400000;
// 周次
Date.prototype.weekOfYear = function () {
    var year = this.getFullYear();
    var d = new Date(this);
    d.setHours(0, 0, 0, 0);
    // 当年的第一天
    var yearStart = new Date(year, 0, 1);
    // 修正第一天周数的偏移量
    d.setDate(d.getDate() + yearStart.getDay());
    var deltaDay = (d.getTime() - yearStart.getTime()) / this.ONE_DAY + 1;
    var weekNo = Math.ceil(deltaDay / 7);
    return [year, weekNo];
};
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12,
        "H+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds() //毫秒
    };
    //年
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    //星期
    if (/(E+)/.test(fmt)) {
        var week = ["日", "一", "二", "三", "四", "五", "六"];
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[this.getDay()]);
    }
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
Date.prototype.addDay = function (days) {
    this.setTime(this.getTime() + this.ONE_DAY * days);
    return this;
};
function now(format) {
    return new Date().format(format || "yyyy/MM/dd HH:mm:ss");
}
exports.now = now;
String.prototype.dateFormat = function (fmt) {
    if (fmt === void 0) { fmt = "yyyy-MM-dd"; }
    var dateStr = this;
    // yyyy-MM-dd
    if (dateStr.length === 10)
        dateStr += ' 00:00:00';
    // yyyy-MM
    if (dateStr.length == 7)
        dateStr += '-01 00:00:00';
    return new Date(dateStr.replace(/-/g, '/')).format(fmt);
};
