# Tabs


### Properties

- tabs.flex: boolean 不需要滚动
- tab-item.active-class: tab-item 激活时的样式

### Usage

- app.json
```json
{
  "usingComponents": {
    "tabs": "mp/components/tabs/tabs",
    "tab-item": "mp/components/tabs/tab-item"
  }
}
```

- wxml
```html
<tabs flex>
  <tab-item class='tab-item' active-class="tab-item__active">tab1</tab-item>
  <tab-item class='tab-item' active-class="tab-item__active">tab2</tab-item>
</tabs>
```
