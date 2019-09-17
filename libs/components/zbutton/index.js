Component({
    data: {
        status: 'normal'
    },
    options: {
        addGlobalClass: true
    },
    methods: {
        onTap: function (e) {
            var _this = this;
            console.log('zz');
            var status = this.data.status;
            if (status == 'normal') {
                status = 'confirm';
            }
            else if (status == 'confirm') {
                this.triggerEvent('tap', function () { return _this.complete(); });
                status = 'process';
            }
            this.setData({ status: status });
        },
        cancel: function () {
            this.setData({ status: 'normal' });
        },
        complete: function () {
            this.setData({ status: 'normal' });
        },
        catch: function () { },
    }
});
//# sourceMappingURL=index.js.map