// libs/components/modal.js

/**
 * # Event
 * - bind:dismiss
 *
 * ```
 * "usingComponents": {
 *    "modal": "/libs/components/modal/modal"
 * }
 * ```
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) {
        if (newVal == false && oldVal == true && this.data.dismissing == false) {
          this.setData({show: true});
          this.dismiss()
        } else {
          this.setData({dismissing: false});
        }
      }

    },
  },
  options: {
    addGlobalClass: true
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    dismissing: false
  }
  ,

  /**
   * 组件的方法列表
   */
  methods: {
    dismiss(e)
    {
      if (this.data.dismissing) return;

      this.setData({dismissing: true});
      setTimeout(() => {
        this.setData({show: false});
        this.triggerEvent("dismiss")
      }, 300)
    },
    catch(e) { }
  },
})
;

