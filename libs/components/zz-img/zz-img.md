zz-img
---

### INSTALL
```json
{
  "usingComponents": {
    "fab": "mp/components/zz-img/index"
  }
}
```

#### CONFIG
```ts
ZZ_IMG_CONFIG.BASE_URL = Data.get("img_host") || "http://img.zunjiahui.cn/";
```

#### Properties
|key|info|
|---|---|
|src|同 `<img/> src`|
|mode|同 `<img/> mode`|
|scaleToFill|拉伸，同 mode='scaleToFill'|
|aspectFit|全部显示，同 mode='aspectFit'|
|aspectFill|裁剪，同 mode='aspectFill'|
|widthFix|高度自适应,同 mode='widthFix'|


