Component({
    relations: {
        'slider-item': { type: "child" }
    },
    methods: {
        reset: function (target) {
            this.getRelationNodes('slider-item').forEach(function (item) { return item != target && item.reset(); });
        },
    },
    pageLifetimes: {
        hide: function () {
            this.reset();
        }
    },
});
