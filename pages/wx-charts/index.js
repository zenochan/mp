"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mp_1 = require("../../libs/mp");
var wx_charts_1 = require("../../libs/sdk/wx-charts/wx-charts");
var pieChart;
var ringChart;
var lineChart;
var windowWidth = 320;
mp_1.HookPage({
    navTitle: "Wx-Charts",
    touchHandler: function (e) {
        console.log(pieChart.getCurrentDataIndex(e));
        pieChart.showToolTip(e);
    },
    onLoad: function (e) {
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        }
        catch (e) {
            console.error('getSystemInfoSync failed!');
        }
        this.pieChart();
        this.ringChart();
        this.lineChart();
    },
    pieChart: function () {
        pieChart = new wx_charts_1.WxCharts({
            animation: true,
            canvasId: 'pieCanvas',
            type: 'pie',
            series: [
                { name: '成交量1', data: 15 },
                { name: '成交量2', data: 35 },
                { name: '成交量3', data: 78 },
                { name: '成交量4', data: 63 },
                { name: '成交量2', data: 35 },
                { name: '成交量3', data: 78 },
                { name: '成交量4', data: 63 },
                { name: '成交量2', data: 35 },
                { name: '成交量3', data: 78 },
                { name: '成交量3', data: 78 }
            ],
            width: windowWidth,
            height: 300,
            dataLabel: true,
        });
    },
    ringChart: function () {
        ringChart = new wx_charts_1.WxCharts({
            animation: true,
            canvasId: 'ringCanvas',
            type: 'ring',
            series: [
                { name: '成交量1', data: 15 },
                { name: '成交量2', data: 35 },
                { name: '成交量3', data: 78 },
                { name: '成交量4', data: 63 },
                { name: '成交量2', data: 35 },
                { name: '成交量3', data: 78 },
                { name: '成交量4', data: 63 },
                { name: '成交量2', data: 35 },
                { name: '成交量3', data: 78 },
                { name: '成交量3', data: 78 }
            ],
            width: windowWidth,
            height: 300,
            dataLabel: true,
        });
    },
    createSimulationData: function () {
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
        };
    },
    lineChart: function () {
        var simulationData = this.createSimulationData();
        lineChart = new wx_charts_1.WxCharts({
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
});
//# sourceMappingURL=index.js.map