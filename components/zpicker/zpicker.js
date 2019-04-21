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
        dateEnd: ''
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
        dateStart: { type: String, value: "" },
        dateEnd: { type: String, value: "" }
    },
    methods: {
        onChange: function (event) {
            var value = this.data.range[event.detail.value] || event.detail.value;
            this.triggerEvent('change', { value: value });
        }
    },
    ready: function () {
        if (this.data.mode == 'date') {
            this.setData({ start: new Date().format('yyyy-MM-dd') });
            console.log(this.data);
        }
    }
});
//# sourceMappingURL=zpicker.js.map