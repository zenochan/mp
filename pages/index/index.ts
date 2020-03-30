import {HookPage} from "../../libs/wx/weapp";

HookPage({
  navTitle: "Zeno Lib",
  data: {
    menu: [
      {
        name: "功能组件",
        children: [
          {name: "授权定位弹窗", page: "/pages/location-deny/index"}
        ]
      }
    ]
  }


});
