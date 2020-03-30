Component({
    data: {
        height: 0
    },
    relations: {
        '../header/header': {
            type: "child",
            linked: function (target) {
                this.header = target;
            }
        },
        '../body/body': {
            type: "child",
            linked: function (target) {
                this.body = target;
            }
        },
        '../footer/footer': {
            type: "child",
            linked: function (target) {
                this.footer = target;
            }
        }
    },
    methods: {
        resizeBody: function () {
            var h = this.data.height;
            if (this.header) {
                h -= this.header.data.bodyHeight;
            }
            if (this.footer) {
                h -= this.footer.data.bodyHeight;
            }
            this.body.setData({ height: h + 'px' });
        }
    },
    ready: function () {
        var _this = this;
        wx.getSystemInfo({
            success: function (info) {
                console.log(info.windowHeight);
                _this.data.height = info.windowHeight;
            }
        });
    }
});
