// eslint-disable-next-line no-undef
Component({
    data: {
        show: false,
        position: '',
    },
    properties: {
        position: { type: String, value: '' },
        shadowColor: { type: String, value: 'rgba(0, 0, 0, 0)' },
        autoHide: { type: Boolean, value: true },
    },
    options: {
        multipleSlots: true,
        addGlobalClass: true,
    },
    methods: {
        show: function () {
            this.setData({ show: true });
        },
        hide: function () {
            this.setData({ show: false });
        },
        onClickTip: function () {
            if (this.data.autoHide)
                this.hide();
        },
    },
});
//# sourceMappingURL=index.js.map