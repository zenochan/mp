Component({
    properties: {
        placeholder: { type: String, value: "" },
        value: { type: String, value: "" },
        autoHeight: { type: Boolean, value: false },
        disabled: { type: Boolean, value: false }
    },
    options: {
        addGlobalClass: true
    },
    methods: {
        focus: function () {
            if (this.data.disabled)
                return;
            this.setData({ focus: true });
        },
        onInput: function (e) {
            var value = e.detail.value;
            this.setData({ value: value });
            this.triggerEvent("input", { value: value });
        },
        onBlur: function () {
            this.setData({ focus: false });
        }
    }
});
//# sourceMappingURL=index.js.map