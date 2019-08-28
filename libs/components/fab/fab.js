Component({
    data: {
        open: false
    },
    options: {
        addGlobalClass: true
    },
    properties: {
        src: { type: String, value: '' },
        right: { type: Number, value: 88 },
        bottom: { type: Number, value: 88 },
    },
    methods: {
        toggle: function () {
            this.setData({ open: !this.data.open });
        }
    }
});
//# sourceMappingURL=fab.js.map