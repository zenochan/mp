Component({
  relations: {
    "../body/body": {type: "parent"}
  },
  methods: {
    onScroll(e: WXEvent)
    {
      this.data.scrollTop = e.detail.scrollTop;
    },
    onScrollToUpper(e)
    {
      this.data.upper = true
    },
    onTouchStart(e)
    {
    },
    onTouchMove(e)
    {
    },
    onTouchEnd(e)
    {
    }
  }
});
