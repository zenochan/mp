"use strict";
exports.__esModule = true;
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
        datetimeEnd: ''
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
        value: { type: null, value: null },
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
            type: String, value: '2010-01-01 00:00',
            observer: function (newVal, oldVal) {
                if (newVal == 'today') {
                    this.data.datetimeStart = new Date().format('yyyy-MM-dd HH:mm');
                }
                this.data.multiIndex = null;
                this.initDatetime();
            }
        },
        datetimeEnd: {
            type: String, value: null,
            observer: function (newVal, oldVal) {
                if (newVal == 'today') {
                    this.data.datetimeEnd = new Date().format('yyyy-MM-dd HH:mm');
                }
                this.data.multiIndex = null;
                this.initDatetime();
            }
        },
        region: {
            type: Boolean, value: false,
            observer: function (newVal, oldVal) {
                this.setData({ mode: 'region' });
            }
        },
        dateStart: {
            type: String, value: "",
            observer: function (newVal) {
                if (newVal == 'today') {
                    this.setData({ dateStart: new Date().format('yyyy-MM-dd') });
                }
            }
        },
        dateEnd: {
            type: String, value: "",
            observer: function (newVal) {
                if (newVal == 'today') {
                    this.setData({ dateEnd: new Date().format('yyyy-MM-dd') });
                }
            }
        },
        dateFields: { type: String, value: "day" }
    },
    methods: {
        onChange: function (event) {
            var value = this.data.range[event.detail.value] || event.detail.value;
            var code = event.detail.code;
            if (this.data.datetime) {
                var index = this.data.multiIndex;
                var year = this.data.multiArray[0][index[0]];
                var month = this.data.multiArray[1][index[1]];
                var day = this.data.multiArray[2][index[2]];
                var hour = this.data.multiArray[3][index[3]];
                var minute = this.data.multiArray[4][index[4]];
                value = year + "-" + month + "-" + day + " " + hour + ":" + minute;
            }
            this.triggerEvent('change', { value: value, code: code });
        },
        initDatetime: function () {
            var years = [];
            var months = [];
            var days = [];
            var hours = [];
            var minutes = [];
            var today = new Date();
            var now = today.format("yyyy:MM:dd:HH:mm").split(":").map(function (item) { return parseInt(item); });
            var start = this.data.datetimeStart.dateFormat("yyyy:MM:dd:HH:mm").split(":").map(function (item) { return parseInt(item); });
            var end = null;
            if (this.data.datetimeEnd) {
                end = this.data.datetimeEnd.dateFormat("yyyy:MM:dd:HH:mm").split(":").map(function (item) { return parseInt(item); });
            }
            years = stringArray(start[0], end ? end[0] : today.getFullYear() + 5);
            var _a = this.data, choose_year = _a.choose_year, choose_month = _a.choose_month, choose_day = _a.choose_day, choose_h = _a.choose_h, choose_m = _a.choose_m;
            choose_year = choose_year || (end || start || now)[0];
            choose_month = choose_month || (end || start || now)[1];
            choose_day = choose_day || (end || start || now)[2];
            choose_h = choose_h || (end || start || now)[3];
            choose_m = choose_m || (end || start || now)[4];
            var monthStart = 1;
            var monthEnd = 12;
            if (start && choose_year == start[0]) {
                monthStart = start[1];
            }
            if (end && choose_year == end[0]) {
                monthEnd = end[1];
            }
            months = stringArray(monthStart, monthEnd);
            var dayStart = 1;
            var dayEnd = 31;
            if (start && choose_year == start[0] && choose_month == start[1]) {
                dayStart = start[2];
            }
            if (end && choose_year == end[0] && choose_month == end[1]) {
                dayEnd = end[2];
            }
            days = monthDays(choose_year, choose_month, dayStart, dayEnd);
            var hStart = 0;
            var hEnd = 23;
            if (start && choose_year == start[0] && choose_month == start[1] && choose_day == start[2]) {
                hStart = start[3];
            }
            if (end && choose_year == end[0] && choose_month == end[1] && choose_day == end[2]) {
                hEnd = end[3];
            }
            hours = stringArray(hStart, hEnd);
            var mStart = 0;
            var mEnd = 59;
            if (start && choose_year == start[0] && choose_month == start[1] && choose_day == start[2] && choose_h == start[3]) {
                mStart = start[4];
            }
            if (end && choose_year == end[0] && choose_month == end[1] && choose_day == end[2] && choose_h == end[3]) {
                mEnd = end[4];
            }
            minutes = stringArray(mStart, mEnd);
            var multiArray = [years, months, days, hours, minutes];
            var multiIndex = this.data.multiIndex;
            if (!multiIndex) {
                var n = today.format('yyyy:MM:dd:HH:mm').split(':');
                multiIndex = [
                    multiArray[0].indexOf(n[0]),
                    multiArray[1].indexOf(n[1]),
                    multiArray[2].indexOf(n[2]),
                    multiArray[3].indexOf(n[3]),
                    multiArray[4].indexOf(n[4]),
                ];
            }
            for (var i = 0; i < multiIndex.length; i++) {
                // index 修正
                multiIndex[i] = Math.min(multiIndex[i], multiArray[i].length - 1);
                multiIndex[i] = Math.max(multiIndex[i], 0);
            }
            this.setData({ multiArray: multiArray, multiIndex: multiIndex });
        },
        onColumnChange: function (e) {
            if (this.data.datetime) {
                var key = ['choose_year', 'choose_month', 'choose_day', 'choose_h', 'choose_m'];
                var _a = e.detail, column = _a.column, value = _a.value;
                var data = {};
                data[key[column]] = this.data.multiArray[column][value];
                this.setData(data);
                this.data.multiIndex[column] = value;
                this.initDatetime();
            }
        }
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
