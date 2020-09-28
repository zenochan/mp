import {WX_CHARTS_CONFIG} from "./config";
import {Event} from "./Event";
import {drawCharts} from "./draw-charts";
import {
  findCurrentIndex,
  findPieChartCurrentIndex,
  findRadarChartCurrentIndex,
  getSeriesDataItem,
  getToolTipData
} from "./charts-data";
import {calValidDistance} from "./charts-util";
import {ChartAnimation} from "./chartAnimation";

export class WxCharts {
  config: any;
  context: wx.CanvasContext
  event: Event = new Event();
  scrollOption: any
  chartData: any = {};
  animationInstance: ChartAnimation;

  constructor(private readonly opts: {
    canvasId: string,       // canvas-id
    width: number           // canvas 宽度(px)
    height: number          // canvas 高度(px)
    background?: string     // 背景颜色(default `#ffffff`)

    // - default false
    // - 是否开启图标可拖拽滚动
    // - 支持 line,area(需配合绑定 scrollStart,scroll,scrollEnd))
    enableScroll?: boolean

    // 图标类别
    type: 'pie' | 'line' | 'column' | 'area' | 'ring' | 'radar'

    title?: {
      name?: string,
      fontSize?: number     // px
      color?: string
    },

    // - only for ring chart
    subtitle?: {
      name?: string
      offsetX?: number      // px
      fontSize?: number     // px
      color?: string
    },

    animation?: boolean,    // default true 是否动画展示
    legend?: boolean,       // default true 是否显示图标下方可类别标识

    categories?: any[]      // 数据类别分类(饼图，圆环图不需要)

    dataLabel?: boolean,    // default true, 是否在图中显示数据内容值
    dataPointShape?: boolean// default true, 是否在图中显示数据点图形标识
    disablePieStroke?: boolean    // default false, 不绘制饼图（圆环图）各区块的白色分割线
    xAxis?: {               // x轴配置
      gridColor?: string    // default #ccc
      fontColor?: string    // default #666
      disableGrid?: boolean // default false
      type?: string         // 刻度值
    },
    yAxis?: any,
    extra?: any,
    series?: {
      name: string,
      data: number,
      color?: string,
      format?: any,
    }[]
    tooltip?: any
  }) {
    opts.title = opts.title || {};
    opts.subtitle = opts.subtitle || {};
    opts.yAxis = opts.yAxis || {};
    opts.xAxis = opts.xAxis || {};
    opts.extra = opts.extra || {};
    opts.legend = opts.legend !== false;
    opts.animation = opts.animation !== false;

    let config = Object.assign({}, WX_CHARTS_CONFIG);
    config.yAxisTitleWidth = opts.yAxis.disabled !== true && opts.yAxis.title ? config.yAxisTitleWidth : 0;
    config.pieChartLinePadding = opts.dataLabel === false ? 0 : config.pieChartLinePadding;
    config.pieChartTextPadding = opts.dataLabel === false ? 0 : config.pieChartTextPadding;

    this.opts = opts;
    this.config = config;
    this.context = wx.createCanvasContext(opts.canvasId);


    this.event = new Event();
    this.scrollOption = {
      currentOffset: 0,
      startTouchX: 0,
      distance: 0
    }

    drawCharts(this, opts.type, opts, config, this.context);
  }

  updateData(data: any = {}) {
    this.opts.series = data.series || this.opts.series;
    this.opts.categories = data.categories || this.opts.categories;

    this.opts.title = Object.assign({}, this.opts.title, data.title || {});
    this.opts.subtitle = Object.assign({}, this.opts.subtitle, data.subtitle || {});

    drawCharts.call(this, this.opts.type, this.opts, this.config, this.context);
  }

  stopAnimation() {
    this.animationInstance && this.animationInstance.stop();
  }

  addEventListener(type, listener) {
    this.event.addEventListener(type, listener);
  }

  getCurrentDataIndex(e) {
    let touches = e.touches && e.touches.length ? e.touches : e.changedTouches;
    if (touches && touches.length) {
      let {x, y} = touches[0];
      if (this.opts.type === 'pie' || this.opts.type === 'ring') {
        return findPieChartCurrentIndex({x, y}, this.chartData.pieData);
      } else if (this.opts.type === 'radar') {
        return findRadarChartCurrentIndex({x, y}, this.chartData.radarData, this.opts.categories.length);
      } else {
        return findCurrentIndex({
          x,
          y
        }, this.chartData.xAxisPoints, this.opts, this.config, Math.abs(this.scrollOption.currentOffset));
      }
    }
    return -1;
  }

  showToolTip(e, option = {}) {
    if (this.opts.type === 'line' || this.opts.type === 'area') {
      let index = this.getCurrentDataIndex(e);
      let {currentOffset} = this.scrollOption;
      let opts = Object.assign({}, this.opts, {
        _scrollDistance_: currentOffset,
        animation: false
      });
      if (index > -1) {
        let seriesData = getSeriesDataItem(this.opts.series, index);
        if (seriesData.length !== 0) {
          let {textList, offset} = getToolTipData(seriesData, this.chartData.calPoints, index, this.opts.categories, option);
          opts.tooltip = {
            textList,
            offset,
            option
          };
        }
      }
      drawCharts.call(this, opts.type, opts, this.config, this.context);
    }
  }

  scrollStart(e) {
    if (e.touches[0] && this.opts.enableScroll === true) {
      this.scrollOption.startTouchX = e.touches[0].x;
    }
  }

  scroll(e) {
    // TODO throtting...
    if (e.touches[0] && this.opts.enableScroll === true) {
      let _distance = e.touches[0].x - this.scrollOption.startTouchX;
      let {currentOffset} = this.scrollOption;
      let validDistance = calValidDistance(currentOffset + _distance, this.chartData, this.config, this.opts);

      this.scrollOption.distance = _distance = validDistance - currentOffset;
      let opts = Object.assign({}, this.opts, {
        _scrollDistance_: currentOffset + _distance,
        animation: false
      });

      drawCharts.call(this, opts.type, opts, this.config, this.context);
    }
  }

  scrollEnd(e) {
    if (this.opts.enableScroll === true) {
      let {currentOffset, distance} = this.scrollOption;
      this.scrollOption.currentOffset = currentOffset + distance;
      this.scrollOption.distance = 0;
    }
  }
}
