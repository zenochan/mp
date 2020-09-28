"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var draw_1 = require("./draw");
var charts_data_1 = require("./charts-data");
var chartAnimation_1 = require("./chartAnimation");
var charts_util_1 = require("./charts-util");
function drawCharts(chart, type, opts, config, context) {
    var _this = this;
    var series = opts.series;
    var categories = opts.categories;
    series = charts_util_1.fillSeriesColor(series, config);
    var legendHeight = charts_data_1.calLegendData(series, opts, config).legendHeight;
    config.legendHeight = legendHeight;
    var yAxisWidth = charts_data_1.calYAxisData(series, opts, config).yAxisWidth;
    config.yAxisWidth = yAxisWidth;
    if (categories && categories.length) {
        var _a = charts_data_1.calCategoriesData(categories, opts, config), xAxisHeight = _a.xAxisHeight, angle = _a.angle;
        config.xAxisHeight = xAxisHeight;
        config._xAxisTextAngle_ = angle;
    }
    if (type === 'pie' || type === 'ring') {
        config._pieTextMaxLength_ = opts.dataLabel === false ? 0 : charts_data_1.getPieTextMaxLength(series);
    }
    var duration = opts.animation ? 1000 : 0;
    chart.animationInstance && chart.animationInstance.stop();
    switch (type) {
        case 'line':
            chart.animationInstance = new chartAnimation_1.ChartAnimation({
                timing: 'easeIn',
                duration: duration,
                onProcess: function (process) {
                    draw_1.drawYAxisGrid(opts, config, context);
                    var _a = draw_1.drawLineDataPoints(series, opts, config, context, process), xAxisPoints = _a.xAxisPoints, calPoints = _a.calPoints, eachSpacing = _a.eachSpacing;
                    chart.chartData.xAxisPoints = xAxisPoints;
                    chart.chartData.calPoints = calPoints;
                    chart.chartData.eachSpacing = eachSpacing;
                    draw_1.drawXAxis(categories, opts, config, context);
                    draw_1.drawLegend(opts.series, opts, config, context);
                    draw_1.drawYAxis(series, opts, config, context);
                    draw_1.drawToolTipBridge(opts, config, context, process);
                    draw_1.drawCanvas(opts, context);
                },
                onAnimationFinish: function () {
                    chart.event.trigger('renderComplete');
                }
            });
            break;
        case 'column':
            this.animationInstance = new chartAnimation_1.ChartAnimation({
                timing: 'easeIn',
                duration: duration,
                onProcess: function (process) {
                    draw_1.drawYAxisGrid(opts, config, context);
                    var _a = draw_1.drawColumnDataPoints(series, opts, config, context, process), xAxisPoints = _a.xAxisPoints, eachSpacing = _a.eachSpacing;
                    _this.chartData.xAxisPoints = xAxisPoints;
                    _this.chartData.eachSpacing = eachSpacing;
                    draw_1.drawXAxis(categories, opts, config, context);
                    draw_1.drawLegend(opts.series, opts, config, context);
                    draw_1.drawYAxis(series, opts, config, context);
                    draw_1.drawCanvas(opts, context);
                },
                onAnimationFinish: function () {
                    _this.event.trigger('renderComplete');
                }
            });
            break;
        case 'area':
            this.animationInstance = new chartAnimation_1.ChartAnimation({
                timing: 'easeIn',
                duration: duration,
                onProcess: function (process) {
                    draw_1.drawYAxisGrid(opts, config, context);
                    var _a = draw_1.drawAreaDataPoints(series, opts, config, context, process), xAxisPoints = _a.xAxisPoints, calPoints = _a.calPoints, eachSpacing = _a.eachSpacing;
                    _this.chartData.xAxisPoints = xAxisPoints;
                    _this.chartData.calPoints = calPoints;
                    _this.chartData.eachSpacing = eachSpacing;
                    draw_1.drawXAxis(categories, opts, config, context);
                    draw_1.drawLegend(opts.series, opts, config, context);
                    draw_1.drawYAxis(series, opts, config, context);
                    draw_1.drawToolTipBridge(opts, config, context, process);
                    draw_1.drawCanvas(opts, context);
                },
                onAnimationFinish: function () {
                    _this.event.trigger('renderComplete');
                }
            });
            break;
        case 'ring':
        case 'pie':
            this.animationInstance = new chartAnimation_1.ChartAnimation({
                timing: 'easeInOut',
                duration: duration,
                onProcess: function (process) {
                    chart.chartData.pieData = draw_1.drawPieDataPoints(series, opts, config, context, process);
                    draw_1.drawLegend(opts.series, opts, config, context);
                    draw_1.drawCanvas(opts, context);
                },
                onAnimationFinish: function () {
                    chart.event.trigger('renderComplete');
                }
            });
            break;
        case 'radar':
            this.animationInstance = new chartAnimation_1.ChartAnimation({
                timing: 'easeInOut',
                duration: duration,
                onProcess: function (process) {
                    _this.chartData.radarData = draw_1.drawRadarDataPoints(series, opts, config, context, process);
                    draw_1.drawLegend(opts.series, opts, config, context);
                    draw_1.drawCanvas(opts, context);
                },
                onAnimationFinish: function () {
                    _this.event.trigger('renderComplete');
                }
            });
            break;
    }
}
exports.drawCharts = drawCharts;
//# sourceMappingURL=draw-charts.js.map