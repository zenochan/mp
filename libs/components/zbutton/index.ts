type STATUS = 'normal' | 'confirm' | 'process'

Component({
  data: {
    status: 'normal'
  },

  options: {
    addGlobalClass: true
  },
  methods: {
    onTap(e)
    {
      console.log('zz');
      let status: STATUS = this.data.status;
      if (status == 'normal') {
        status = 'confirm';
      } else if (status == 'confirm') {
        this.triggerEvent('tap', () => this.complete());
        status = 'process';
      }
      this.setData({status});
    },

    cancel()
    {
      this.setData({status: 'normal'});
    },

    complete()
    {
      this.setData({status: 'normal'});
    },
    catch() { },
  }
});
