import {WX} from "../../wx/WX";

Component({
  data: {
    statusBar: 44,
    height: '',
    //默认值  默认显示左上角
    navbarData: {
      showCapsule: 1
    }
  },
  properties: {
    navbarData: {   //navbarData   由父页面传递的数据，变量名字自命名
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {}
    }
  },
  attached: function () {
    // 获取是否是通过分享进入的小程序
    this.setData({
      share: false
    });

    WX.isIphone().subscribe(iphone => {

      if (!iphone) this.setData({statusBar: 40});

    });
    // 定义导航栏的高度   方便对齐
    wx.getSystemInfo({
      success: (res) => {
        let iphone = res.model.indexOf("iPhone") != -1;
        let statusBar = (iphone ? 44 : 40);
        this.setData({
          statusBar,
          height: res.statusBarHeight+statusBar
        });
        // this.globalData.height = res.statusBarHeight
      }
    });
  },
  methods: {
    // 返回上一页面
    _navback()
    {
      wx.navigateBack()
    },
    //返回到首页
    _backhome()
    {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  }
});
