# 侧滑删除组件

```json
{
  "usingComponents": {
    "slider-list": "mp/components/slider/slider-list",
    "slider-item": "mp/components/slider/slider-item"
  }
}
```

```html
<slider-list>
  <slider-item wx:for="{{data}}" wx:for-item="cart" wx:key="index">
    <div class="cart" slot="body">
      内容
    </div>
    <div class="delete" slot="buttons" bind:tap="delete" data-item="{{item}}">
      删除
    </div>
  </slider-item>
</slider-list>
```
