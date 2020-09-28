"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var Event_1 = require("./Event");
var draw_charts_1 = require("./draw-charts");
var charts_data_1 = require("./charts-data");
var charts_util_1 = require("./charts-util");
var WxCharts = /** @class */ (function () {
    function WxCharts(opts) {
        this.opts = opts;
        this.event = new Event_1.Event();
        this.chartData = {};
        opts.title = opts.title || {};
        opts.subtitle = opts.subtitle || {};
        opts.yAxis = opts.yAxis || {};
        opts.xAxis = opts.xAxis || {};
        opts.extra = opts.extra || {};
        opts.legend = opts.legend !== false;
        opts.animation = opts.animation !== false;
        var config = Object.assign({}, config_1.WX_CHARTS_CONFIG);
        config.yAxisTitleWidth = opts.yAxis.disabled !== true && opts.yAxis.title ? config.yAxisTitleWidth : 0;
        config.pieChartLinePadding = opts.dataLabel === false ? 0 : config.pieChartLinePadding;
        config.pieChartTextPadding = opts.dataLabel === false ? 0 : config.pieChartTextPadding;
        this.opts = opts;
        this.config = config;
        this.context = wx.createCanvasContext(opts.canvasId);
        this.event = new Event_1.Event();
        this.scrollOption = {
            currentOffset: 0,
            startTouchX: 0,
            distance: 0
        };
        draw_charts_1.drawCharts(this, opts.type, opts, config, this.context);
    }
    WxCharts.prototype.updateData = function (data) {
        if (data === void 0) { data = {}; }
        this.opts.series = data.series || this.opts.series;
        this.opts.categories = data.categories || this.opts.categories;
        this.opts.title = Object.assign({}, this.opts.title, data.title || {});
        this.opts.subtitle = Object.assign({}, this.opts.subtitle, data.subtitle || {});
        draw_charts_1.drawCharts.call(this, this.opts.type, this.opts, this.config, this.context);
    };
    WxCharts.prototype.stopAnimation = function () {
        this.animationInstance && this.animationInstance.stop();
    };
    WxCharts.prototype.addEventListener = function (type, listener) {
        this.event.addEventListener(type, listener);
    };
    WxCharts.prototype.getCurrentDataIndex = function (e) {
        var touches = e.touches && e.touches.length ? e.touches : e.changedTouches;
        if (touches && touches.length) {
            var _a = touches[0], x = _a.x, y = _a.y;
            if (this.opts.type === 'pie' || this.opts.type === 'ring') {
                return charts_data_1.findPieChartCurrentIndex({ x: x, y: y }, this.chartData.pieData);
            }
            else if (this.opts.type === 'radar') {
                return charts_data_1.findRadarChartCurrentIndex({ x: x, y: y }, this.chartData.radarData, this.opts.categories.length);
            }
            else {
                return charts_data_1.findCurrentIndex({
                    x: x,
                    y: y
                }, this.chartData.xAxisPoints, this.opts, this.config, Math.abs(this.scrollOption.currentOffset));
            }
        }
        return -1;
    };
    WxCharts.prototype.showToolTip = function (e, option) {
        if (option === void 0) { option = {}; }
        if (this.opts.type === 'line' || this.opts.type === 'area') {
            var index = this.getCurrentDataIndex(e);
            var currentOffset = this.scrollOption.currentOffset;
            var opts = Object.assign({}, this.opts, {
                _scrollDistance_: currentOffset,
                animation: false
            });
            if (index > -1) {
                var seriesData = charts_data_1.getSeriesDataItem(this.opts.series, index);
                if (seriesData.length !== 0) {
                    var _a = charts_data_1.getToolTipData(seriesData, this.chartData.calPoints, index, this.opts.categories, option), textList = _a.textList, offset = _a.offset;
                    opts.tooltip = {
                        textList: textList,
                        offset: offset,
                        option: option
                    };
                }
            }
            draw_charts_1.drawCharts.call(this, opts.type, opts, this.config, this.context);
        }
    };
    WxCharts.prototype.scrollStart = function (e) {
        if (e.touches[0] && this.opts.enableScroll === true) {
            this.scrollOption.startTouchX = e.touches[0].x;
        }
    };
    WxCharts.prototype.scroll = function (e) {
        // TODO throtting...
        if (e.touches[0] && this.opts.enableScroll === true) {
            var _distance = e.touches[0].x - this.scrollOption.startTouchX;
            var currentOffset = this.scrollOption.currentOffset;
            var validDistance = charts_util_1.calValidDistance(currentOffset + _distance, this.chartData, this.config, this.opts);
            this.scrollOption.distance = _distance = validDistance - currentOffset;
            var opts = Object.assign({}, this.opts, {
                _scrollDistance_: currentOffset + _distance,
                animation: false
            });
            draw_charts_1.drawCharts.call(this, opts.type, opts, this.config, this.context);
        }
    };
    WxCharts.prototype.scrollEnd = function (e) {
        if (this.opts.enableScroll === true) {
            var _a = this.scrollOption, currentOffset = _a.currentOffset, distance = _a.distance;
            this.scrollOption.currentOffset = currentOffset + distance;
            this.scrollOption.distance = 0;
        }
    };
    return WxCharts;
}());
exports.WxCharts = WxCharts;
//# sourceMappingURL=wx-charts.js.map