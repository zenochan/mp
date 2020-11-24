import { HookPage } from '../../libs/wx/weapp';

HookPage({
  navTitle: 'Zeno Lib',
  data: {
    menu: [
      {
        name: '布局组件',
        children: [
          { name: 'header/footer', page: '/pages/header-footer/index' },
        ],
      },
      {
        name: '功能组件',
        children: [
          { name: '授权定位弹窗', page: '/pages/location-deny/index' },
          { name: 'rich-html', page: '/pages/location-deny/index' },
          { name: 'uploader', page: '/pages/uploader/index' },
          { name: 'header/footer', page: '/pages/header-footer/index' },
        ],
      },
    ],
  },

});
