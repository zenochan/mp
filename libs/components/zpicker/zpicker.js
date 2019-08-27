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