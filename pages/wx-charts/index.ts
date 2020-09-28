import {HookPage} from "../../libs/mp";
import {WxCharts} from "../../libs/sdk/wx-charts/wx-charts";

let pieChart: WxCharts;
let ringChart: WxCharts;
let lineChart: WxCharts;

let windowWidth = 320;

HookPage({
  navTitle: "Wx-Charts",


  touchHandler(e) {
    console.log(pieChart.getCurrentDataIndex(e));
    pieChart.showToolTip(e);
  },
  onLoad: function (e) {
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    this.pieChart();
    this.ringChart();
    this.lineChart();
  },

  pieChart() {
    pieChart = new WxCharts({
      animation: true,
      canvasId: 'pieCanvas',
      type: 'pie',
      series: [
        {name: '成交量1', data: 15},
        {name: '成交量2', data: 35},
        {name: '成交量3', data: 78},
        {name: '成交量4', data: 63},
        {name: '成交量2', data: 35},
        {name: '成交量3', data: 78},
        {name: '成交量4', data: 63},
        {name: '成交量2', data: 35},
        {name: '成交量3', data: 78},
        {name: '成交量3', data: 78}
      ],
      width: windowWidth,
      height: 300,
      dataLabel: true,
    });

  },

  ringChart() {
    ringChart = new WxCharts({
      animation: true,
      canvasId: 'ringCanvas',
      type: 'ring',
      series: [
        {name: '成交量1', data: 15},
        {name: '成交量2', data: 35},
        {name: '成交量3', data: 78},
        {name: '成交量4', data: 63},
        {name: '成交量2', data: 35},
        {name: '成交量3', data: 78},
        {name: '成交量4', data: 63},
        {name: '成交量2', data: 35},
        {name: '成交量3', data: 78},
        {name: '成交量3', data: 78}
      ],
      width: windowWidth,
      height: 300,
      dataLabel: true,
    });

  },

  createSimulationData() {
    var categories = [];
    var data = [];
    for (var i = 0; i < 10; i++) {
      categories.push('2016-' + (i + 1));
      data.push(Math.random() * (20 - 10) + 10);
    }
    // data[4] = null;
    return {
      categories: categories,
      data: data
    }
  },

  lineChart() {
    let simulationData = this.createSimulationData();

    lineChart = new WxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: simulationData.categories,
      animation: true,
      // background: '#f5f5f5',
      series: [{
        name: '成交量1',
        data: simulationData.data,
        format: function (val, name) {
          return val.toFixed(2) + '万';
        }
      }, {
        name: '成交量2',
        data: [2, 0, 0, 3, null, 4, 0, 0, 2, 0],
        format: function (val, name) {
          return val.toFixed(2) + '万';
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '成交金额 (万元)',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      width: windowWidth,
      height: 200,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });

  },

})
