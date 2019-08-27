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
            this.triggerEvent('change', { value: value });
        },
        initDatetime: function () {
            var date = new Date();
            var years = [];
            var months = [];
            var days = [];
            var hours = [];
            var minutes = [];
            var today = new Date();
            years = stringArray(today.getFullYear(), today.getFullYear() + 5);
            months = stringArray(1, 12);
            days = monthDays(today.getFullYear(), today.getMonth() + 1);
            hours = stringArray(0, 23);
            minutes = stringArray(0, 59);
            this.setData({
                multiArray: [years, months, days, hours, minutes],
                multiIndex: [0, today.getMonth(), today.getDate(), today.getHours(), today.getMinutes()]
            });
        },
        onColumnChange: function (e) {
            var _a;
            if (this.data.datetime) {
                //获取年份
                if (e.detail.column == 0) {
                    var choose_year = this.data.multiArray[e.detail.column][e.detail.value];
                    console.log(choose_year);
                    this.setData({ choose_year: choose_year });
                }
                //获取月份
                if (e.detail.column == 1) {
                    var choose_month = this.data.multiArray[e.detail.column][e.detail.value];
                    this.setData({ choose_month: choose_month });
                }
                if (e.detail.column <= 1) {
                    var year = parseInt(this.data.choose_year);
                    var month = this.data.choose_month;
                    var days = monthDays(year, month);
                    this.setData((_a = {}, _a['multiArray[2]'] = days, _a));
                }
                var data = {
                    multiArray: this.data.multiArray,
                    multiIndex: this.data.multiIndex
                };
                data.multiIndex[e.detail.column] = e.detail.value;
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
function monthDays(year, month) {
    if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) { //判断31天的月份
        return stringArray(1, 31);
    }
    else if (month == 4 || month == 6 || month == 9 || month == 11) { //判断30天的月份
        return stringArray(1, 30);
    }
    else if (month == 2) { //判断2月份天数
        if (((year % 400 == 0) || (year % 100 != 0)) && (year % 4 == 0)) {
            return stringArray(1, 29);
        }
        else {
            return stringArray(1, 28);
        }
    }
}
//# sourceMappingURL=zpicker.js.map