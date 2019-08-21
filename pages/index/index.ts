import {HookPage} from "../../libs/wx/weapp";


HookPage({
  navTitle: 'Zeno\' Lib',
  data: {
    html: `<div class="article " id="article" data-islow-browser="0"><div class="article-content"><p><span class="bjh-p">日本最大移动通信运营商都科摩公司20日宣布，将从21日开始接受华为P30 Pro智能手机的预订。至此，日本三大运营商均已重启销售华为手机。</span></p><div class="img-container"><img class="large" data-loadfunc="0" src="https://pics3.baidu.com/feed/1ad5ad6eddc451dabd55d152d57f0363d116326b.jpeg?token=86dd3ecd545ea90ecc06afeded589ee5&amp;s=5F1829C4252334B44811B5050300A041" data-loaded="0"></div><p><span class="bjh-p">日本东京，华为推出新款P30系列手机。</span></p><p><span class="bjh-p"><span class="bjh-br"></span>都科摩公司当天宣布，此前停止接受预订的华为新款智能手机P30 Pro HW-02L将从21日起恢复预订，预计9月正式销售。</span></p><p><span class="bjh-p"><span class="bjh-br"></span>都科摩公司原计划在今年夏天正式开始销售华为P30 Pro智能手机，但在美国商务部宣布对华为公司实施出口管制措施之后，都科摩公司今年5月宣布延期发售。</span></p><p><span class="bjh-p"><span class="bjh-br"></span>日本移动通信运营商KDDI公司本月8日已开始面向日本全国发售华为生产的新款智能手机P30 lite Premium。针对此前用户对华为手机无法更新安卓操作系统的担忧，KDDI表示，安卓系统可以正常更新使用。</span></p><p><span class="bjh-p"><span class="bjh-br"></span>据此间媒体报道，另一运营商软银公司8日也重启了华为手机的销售。</span></p></div><audio height="0" width="0" id="musicAudio" data-play-index=""><source></audio></div>`
  },

  onRefresh()
  {
    console.log("WTF");
    setTimeout(() => {
      console.log("stop");
      this.setData({alreadyLoadData: true});
    }, 500)
  }
});
