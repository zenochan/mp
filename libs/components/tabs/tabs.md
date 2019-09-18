# Tabs


### Properties
- tabs.flex: boolean 不需要滚动
- tabs.name: string page存放activeTabIndex 的KEY
- tabs.bind:change tabs 改变时触发

### Usage

- app.json
```json
{
  "usingComponents": {
    "tabs": "mp/components/tabs/tabs",
    "tab": "mp/components/tabs/tab-item"
  }
}
```

- wxml
```html
<tabs flex>
  <tab class='tab-item' class-active="tab-item__active">tab1</tab>
  <tab class='tab-item' class-active="tab-item__active">tab2</tab>
</tabs>
```
