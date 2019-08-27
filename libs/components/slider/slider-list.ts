Component({
  relations: {
    'slider-item': {type: "child"}
  },
  methods: {
    reset(target)
    {
      this.getRelationNodes('slider-item').forEach(item => item != target && item.reset());
    },
  },
  pageLifetimes: {
    hide()
    {
      this.reset()
    }
  },

});
