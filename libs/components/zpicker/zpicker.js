"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../../utils/extends.date");
/**
 * # Event
 * bind:change
 *
 * # properties
 * range: String[] | Object[]
 * value: String | Object
 */
Component({
    data: {
        range: [],
        rangekey: '',
        value: null,
        mode: 'selector',
        // mode = date
        dateStart: '',
        dateFields: 'day',
        dateEnd: '',
        datetimeStart: '',
        datetimeEnd: '',
        multiIndex: [0, 0, 0, 0, 0]
    },
    externalClasses: ["zclass"],
    properties: {
        range: {
            type: Array,
            value: [],
            observer: function (newVal, oldVal) {
                var _this = this;
                var first = newVal[0];
                if (!this.data.rangekey && first && typeof first == 'object') {
                    Object.keys(first).forEach(function (key) {
                        if (first.hasOwnProperty(key) && typeof first[key] == 'string') {
                            _this.setData({ rangekey: key });
                        }
                    });
                }
            }
        },
        rangekey: { type: String, value: '' },
        disabled: { type: Boolean, value: false },
        value: { type: null, value: null, },
        placeholder: { type: String, value: '请选择' },
        date: {
            type: Boolean,
            value: false,
            observer: function (newVal, oldVal) {
                this.setData({ mode: 'date' });
            }
        },
        datetime: {
            type: Boolean,
            value: false,
            observer: function (newVal, oldVal) {
                this.setData({ range: null, mode: 'multiSelector' });
                this.initDatetime();
            }
        },
        datetimeStart: {
            type: String, value: '2010-01-01 00:00', observer: function (newVal, oldVal) {
                this.initDatetime();
            }
        },
        datetimeEnd: {
            type: String, value: null, observer: function (newVal, oldVal) {
                if (newVal == 'today') {
                    this.data.datetimeEnd = new Date().format('yyyy-MM-dd HH:mm');
                }
                this.initDatetime();
            }
        },
        region: {
            type: Boolean, value: false, observer: function (newVal, oldVal) {
                this.setData({ mode: 'region' });
            }
        },
        dateStart: { type: String, value: "" },
        dateEnd: { type: String, value: "" },
        dateFields: { type: String, value: "day" }
    },
    methods: {
        onChange: function (event) {
            var value = this.data.range[event.detail.value] || event.detail.value;
            if (this.data.datetime) {
                var index = this.data.multiIndex;
                var year = this.data.multiArray[0][index[0]];
                var month = this.data.multiArray[1][index[1]];
                var day = this.data.multiArray[2][index[2]];
                var hour = this.data.multiArray[3][index[3]];
                var minute = this.data.multiArray[4][index[4]];
                value = year + "-" + month + "-" + day + " " + hour + ":" + minute;
            }
            this.triggerEvent('change', { value: value });
        },
        initDatetime: function () {
            console.error('itniDatetime');
            var date = new Date();
            var years = [];
            var months = [];
            var days = [];
            var hours = [];
            var minutes = [];
            var today = new Date();
            var start = this.data.datetimeStart.dateFormat("yyyy:MM:dd:HH:mm").split(":").map(function (item) { return parseInt(item); });
            var end = null;
            if (this.data.datetimeEnd) {
                end = this.data.datetimeEnd.dateFormat("yyyy:MM:dd:HH:mm").split(":").map(function (item) { return parseInt(item); });
            }
            years = stringArray(start[0], end ? end[0] : today.getFullYear() + 5);
            var _a = this.data, choose_year = _a.choose_year, choose_month = _a.choose_month, choose_day = _a.choose_day, choose_h = _a.choose_h, choose_m = _a.choose_m;
            var monthStart = 1;
            var monthEnd = 12;
            if (choose_year == start[0]) {
                monthStart = start[1];
            }
            else if (choose_year == end[0]) {
                monthEnd = end[1];
            }
            months = stringArray(monthStart, monthEnd);
            var dayStart = 1;
            var dayEnd = 31;
            if (choose_year == start[0] && choose_month == start[1]) {
                dayStart = start[2];
            }
            else if (choose_year == end[0] && choose_month == end[1]) {
                dayEnd = end[2];
            }
            days = monthDays(choose_year, choose_month, dayStart, dayEnd);
            var hStart = 0;
            var hEnd = 23;
            if (choose_year == start[0] && choose_month == start[1] && choose_day == start[2]) {
                hStart = start[3];
            }
            else if (choose_year == end[0] && choose_month == end[1] && choose_day == end[2]) {
                hEnd = end[3];
            }
            hours = stringArray(hStart, hEnd);
            var mStart = 0;
            var mEnd = 59;
            if (choose_year == start[0] && choose_month == start[1] && choose_day == start[2] && choose_h == start[3]) {
                mStart = start[4];
            }
            else if (choose_year == end[0] && choose_month == end[1] && choose_day == end[2] && choose_h == end[3]) {
                mEnd = end[4];
            }
            minutes = stringArray(mStart, mEnd);
            var multiArray = [years, months, days, hours, minutes];
            var multiIndex = this.data.multiIndex;
            this.setData({ multiArray: multiArray, multiIndex: multiIndex });
        },
        onColumnChange: function (e) {
            var _a = this.data, choose_year = _a.choose_year, choose_month = _a.choose_month, choose_day = _a.choose_day, choose_h = _a.choose_h, choose_m = _a.choose_m;
            if (this.data.datetime) {
                //获取年份
                if (e.detail.column == 0) {
                    choose_year = this.data.multiArray[e.detail.column][e.detail.value];
                    this.setData({ choose_year: choose_year });
                    this.initDatetime();
                }
                //获取月份
                if (e.detail.column == 1) {
                    choose_month = this.data.multiArray[e.detail.column][e.detail.value];
                    this.setData({ choose_month: choose_month });
                    this.initDatetime();
                }
                //获取日期
                if (e.detail.column == 2) {
                    choose_day = this.data.multiArray[e.detail.column][e.detail.value];
                    this.setData({ choose_day: choose_day });
                    this.initDatetime();
                }
                //获取h
                if (e.detail.column == 3) {
                    choose_h = this.data.multiArray[e.detail.column][e.detail.value];
                    this.setData({ choose_h: choose_h });
                    this.initDatetime();
                }
                //获取m
                if (e.detail.column == 4) {
                    choose_m = this.data.multiArray[e.detail.column][e.detail.value];
                    this.setData({ choose_m: choose_m });
                    this.initDatetime();
                }
                this.data.multiIndex[e.detail.column] = e.detail.value;
                var data = {
                    multiArray: this.data.multiArray,
                    multiIndex: this.data.multiIndex || [0, 0, 0, 0, 0]
                };
                data.multiIndex[0] = choose_month ? data.multiArray[0].indexOf(choose_year) : 0;
                data.multiIndex[1] = choose_month ? data.multiArray[1].indexOf(choose_month) : 0;
                // data.multiIndex[e.detail.column] = e.detail.value;
                this.setData(data);
            }
            // let value = this.data.range[event.detail.value] || event.detail.value;
            // this.triggerEvent('change', {value, code: event.detail.code});
        },
    },
    ready: function () {
    }
});
function stringArray(from, to) {
    var array = [];
    for (var i = from; i <= to; i++) {
        array.push((i >= 10 ? "" : '0') + i);
    }
    return array;
}
function monthDays(year, month, dayStart, dayEnd) {
    if (dayStart === void 0) { dayStart = 1; }
    if (dayEnd === void 0) { dayEnd = 31; }
    if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) { //判断31天的月份
        dayEnd = Math.min(dayEnd, 31);
    }
    else if (month == 4 || month == 6 || month == 9 || month == 11) { //判断30天的月份
        dayEnd = Math.min(dayEnd, 28);
    }
    else if (month == 2) { //判断2月份天数
        if (((year % 400 == 0) || (year % 100 != 0)) && (year % 4 == 0)) {
            dayEnd = Math.min(dayEnd, 29);
        }
        else {
            dayEnd = Math.min(dayEnd, 28);
        }
    }
    return stringArray(dayStart, dayEnd);
}
//# sourceMappingURL=zpicker.js.map