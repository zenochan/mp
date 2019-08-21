Component({
    methods: {
        onClick: function () {
            this.triggerEvent("tap", this.data.mobile);
        },
        onGetPhoneNumber: function (e) {
            if (e.detail.errMsg == "getPhoneNumber:ok") {
                this.setData({ mobile: e.detail });
                this.onClick();
            }
        },
        catchTap: function (e) { }
    }
});
//# sourceMappingURL=open-mobile.js.map