"use strict";
exports.__esModule = true;
exports.calYAxisData = exports.getYAxisTextList = exports.getDataPoints = exports.getXAxisPoints = exports.fixColumeData = exports.getPieTextMaxLength = exports.getPieDataPoints = exports.getRadarDataPoints = exports.calCategoriesData = exports.calLegendData = exports.splitPoints = exports.isInExactPieChartArea = exports.findPieChartCurrentIndex = exports.findRadarChartCurrentIndex = exports.isInExactChartArea = exports.findCurrentIndex = exports.getToolTipData = exports.getRadarCoordinateSeries = exports.getMaxTextListLength = exports.getChartDataAreaBoundary = exports.getSeriesDataItem = void 0;
var util_1 = require("./util");
var charts_util_1 = require("./charts-util");
function dataCombine(series) {
    return series.reduce(function (a, b) {
        return (a.data ? a.data : a).concat(b.data);
    }, []);
}
function getSeriesDataItem(series, index) {
    var data = [];
    series.forEach(function (item) {
        if (item.data[index] !== null && typeof item.data[index] !== 'undefined') {
            var seriesItem = {};
            seriesItem.color = item.color;
            seriesItem.name = item.name;
            seriesItem.data = item.format ? item.format(item.data[index]) : item.data[index];
            data.push(seriesItem);
        }
    });
    return data;
}
exports.getSeriesDataItem = getSeriesDataItem;
function getChartDataAreaBoundary(xAxisPoints) {
    return {
        leftBorder: xAxisPoints[0],
        rightBorder: xAxisPoints[xAxisPoints.length - 1]
    };
}
exports.getChartDataAreaBoundary = getChartDataAreaBoundary;
function getMaxTextListLength(list) {
    var lengthList = list.map(function (item) { return charts_util_1.measureText(item); });
    return Math.max.apply(null, lengthList);
}
exports.getMaxTextListLength = getMaxTextListLength;
function getRadarCoordinateSeries(length) {
    var eachAngle = 2 * Math.PI / length;
    var CoordinateSeries = [];
    for (var i = 0; i < length; i++) {
        CoordinateSeries.push(eachAngle * i);
    }
    return CoordinateSeries.map(function (item) { return -1 * item + Math.PI / 2; });
}
exports.getRadarCoordinateSeries = getRadarCoordinateSeries;
function getToolTipData(seriesData, calPoints, index, categories, option) {
    if (option === void 0) { option = {}; }
    var textList = seriesData.map(function (item) {
        return {
            text: option.format ? option.format(item, categories[index]) : item.name + ": " + item.data,
            color: item.color
        };
    });
    var validCalPoints = [];
    var offset = {
        x: 0,
        y: 0
    };
    calPoints.forEach(function (points) {
        if (typeof points[index] !== 'undefined' && points[index] !== null) {
            validCalPoints.push(points[index]);
        }
    });
    validCalPoints.forEach(function (item) {
        offset.x = Math.round(item.x);
        offset.y += item.y;
    });
    offset.y /= validCalPoints.length;
    return { textList: textList, offset: offset };
}
exports.getToolTipData = getToolTipData;
function findCurrentIndex(currentPoints, xAxisPoints, opts, config, offset) {
    if (offset === void 0) { offset = 0; }
    var currentIndex = -1;
    if (isInExactChartArea(currentPoints, opts, config)) {
        xAxisPoints.forEach(function (item, index) {
            if (currentPoints.x + offset > item) {
                currentIndex = index;
            }
        });
    }
    return currentIndex;
}
exports.findCurrentIndex = findCurrentIndex;
function isInExactChartArea(currentPoints, opts, config) {
    return currentPoints.x < opts.width - config.padding
        && currentPoints.x > config.padding + config.yAxisWidth + config.yAxisTitleWidth
        && currentPoints.y > config.padding
        && currentPoints.y < opts.height - config.legendHeight - config.xAxisHeight - config.padding;
}
exports.isInExactChartArea = isInExactChartArea;
function findRadarChartCurrentIndex(currentPoints, radarData, count) {
    var eachAngleArea = 2 * Math.PI / count;
    var currentIndex = -1;
    if (isInExactPieChartArea(currentPoints, radarData.center, radarData.radius)) {
        var angle_1 = Math.atan2(radarData.center.y - currentPoints.y, currentPoints.x - radarData.center.x);
        angle_1 = -1 * angle_1;
        if (angle_1 < 0) {
            angle_1 += 2 * Math.PI;
        }
        var fixAngle_1 = function (angle) {
            if (angle < 0) {
                angle += 2 * Math.PI;
            }
            if (angle > 2 * Math.PI) {
                angle -= 2 * Math.PI;
            }
            return angle;
        };
        var angleList = radarData.angleList.map(function (item) {
            item = fixAngle_1(-1 * item);
            return item;
        });
        angleList.forEach(function (item, index) {
            var rangeStart = fixAngle_1(item - eachAngleArea / 2);
            var rangeEnd = fixAngle_1(item + eachAngleArea / 2);
            if (rangeEnd < rangeStart) {
                rangeEnd += 2 * Math.PI;
            }
            if ((angle_1 >= rangeStart && angle_1 <= rangeEnd)
                || (angle_1 + 2 * Math.PI >= rangeStart && angle_1 + 2 * Math.PI <= rangeEnd)) {
                currentIndex = index;
            }
        });
    }
    return currentIndex;
}
exports.findRadarChartCurrentIndex = findRadarChartCurrentIndex;
function findPieChartCurrentIndex(currentPoints, pieData) {
    var currentIndex = -1;
    if (isInExactPieChartArea(currentPoints, pieData.center, pieData.radius)) {
        var angle = Math.atan2(pieData.center.y - currentPoints.y, currentPoints.x - pieData.center.x);
        angle = -angle;
        for (var i = 0, len = pieData.series.length; i < len; i++) {
            var item = pieData.series[i];
            if (charts_util_1.isInAngleRange(angle, item._start_, item._start_ + item._proportion_ * 2 * Math.PI)) {
                currentIndex = i;
                break;
            }
        }
    }
    return currentIndex;
}
exports.findPieChartCurrentIndex = findPieChartCurrentIndex;
function isInExactPieChartArea(currentPoints, center, radius) {
    return Math.pow(currentPoints.x - center.x, 2) + Math.pow(currentPoints.y - center.y, 2) <= Math.pow(radius, 2);
}
exports.isInExactPieChartArea = isInExactPieChartArea;
function splitPoints(points) {
    var newPoints = [];
    var items = [];
    points.forEach(function (item, index) {
        if (item !== null) {
            items.push(item);
        }
        else {
            if (items.length) {
                newPoints.push(items);
            }
            items = [];
        }
    });
    if (items.length) {
        newPoints.push(items);
    }
    return newPoints;
}
exports.splitPoints = splitPoints;
function calLegendData(series, opts, config) {
    if (opts.legend === false) {
        return {
            legendList: [],
            legendHeight: 0
        };
    }
    var padding = 5;
    var marginTop = 8;
    var shapeWidth = 15;
    var legendList = [];
    var widthCount = 0;
    var currentRow = [];
    series.forEach(function (item) {
        var itemWidth = 3 * padding + shapeWidth + charts_util_1.measureText(item.name || 'undefined');
        if (widthCount + itemWidth > opts.width) {
            legendList.push(currentRow);
            widthCount = itemWidth;
            currentRow = [item];
        }
        else {
            widthCount += itemWidth;
            currentRow.push(item);
        }
    });
    if (currentRow.length) {
        legendList.push(currentRow);
    }
    return {
        legendList: legendList,
        legendHeight: legendList.length * (config.fontSize + marginTop) + padding
    };
}
exports.calLegendData = calLegendData;
function calCategoriesData(categories, opts, config) {
    var result = {
        angle: 0,
        xAxisHeight: config.xAxisHeight
    };
    var eachSpacing = getXAxisPoints(categories, opts, config).eachSpacing;
    // get max length of categories text
    var categoriesTextLenth = categories.map(function (item) {
        return charts_util_1.measureText(item);
    });
    var maxTextLength = Math.max.apply(this, categoriesTextLenth);
    if (maxTextLength + 2 * config.xAxisTextPadding > eachSpacing) {
        result.angle = 45 * Math.PI / 180;
        result.xAxisHeight = 2 * config.xAxisTextPadding + maxTextLength * Math.sin(result.angle);
    }
    return result;
}
exports.calCategoriesData = calCategoriesData;
function getRadarDataPoints(angleList, center, radius, series, opts, process) {
    if (process === void 0) { process = 1; }
    var radarOption = opts.extra.radar || {};
    radarOption.max = radarOption.max || 0;
    var maxData = Math.max(radarOption.max, Math.max.apply(null, dataCombine(series)));
    var data = [];
    series.forEach(function (each) {
        var listItem = {};
        listItem.color = each.color;
        listItem.data = [];
        each.data.forEach(function (item, index) {
            var tmp = {};
            tmp.angle = angleList[index];
            tmp.proportion = item / maxData;
            tmp.position = charts_util_1.convertCoordinateOrigin(radius * tmp.proportion * process * Math.cos(tmp.angle), radius * tmp.proportion * process * Math.sin(tmp.angle), center);
            listItem.data.push(tmp);
        });
        data.push(listItem);
    });
    return data;
}
exports.getRadarDataPoints = getRadarDataPoints;
function getPieDataPoints(series, process) {
    if (process === void 0) { process = 1; }
    var count = 0;
    var _start_ = 0;
    series.forEach(function (item) {
        item.data = item.data === null ? 0 : item.data;
        count += item.data;
    });
    series.forEach(function (item) {
        item.data = item.data === null ? 0 : item.data;
        item._proportion_ = item.data / count * process;
    });
    series.forEach(function (item) {
        item._start_ = _start_;
        _start_ += 2 * item._proportion_ * Math.PI;
    });
    return series;
}
exports.getPieDataPoints = getPieDataPoints;
function getPieTextMaxLength(series) {
    series = getPieDataPoints(series);
    var maxLength = 0;
    series.forEach(function (item) {
        var text = item.format
            ? item.format(+item._proportion_.toFixed(2))
            : util_1.Util.toFixed(item._proportion_ * 100) + "%";
        maxLength = Math.max(maxLength, charts_util_1.measureText(text));
    });
    return maxLength;
}
exports.getPieTextMaxLength = getPieTextMaxLength;
function fixColumeData(points, eachSpacing, columnLen, index, config, opts) {
    return points.map(function (item) {
        if (item === null) {
            return null;
        }
        item.width = (eachSpacing - 2 * config.columePadding) / columnLen;
        if (opts.extra.column && opts.extra.column.width && +opts.extra.column.width > 0) {
            // customer column width
            item.width = Math.min(item.width, +opts.extra.column.width);
        }
        else {
            // default width should less tran 25px
            // don't ask me why, I don't know
            item.width = Math.min(item.width, 25);
        }
        item.x += (index + 0.5 - (columnLen) / 2) * item.width;
        return item;
    });
}
exports.fixColumeData = fixColumeData;
function getXAxisPoints(categories, opts, config) {
    var yAxisTotalWidth = config.yAxisWidth + config.yAxisTitleWidth;
    var spacingValid = opts.width - 2 * config.padding - yAxisTotalWidth;
    var dataCount = opts.enableScroll ? Math.min(5, categories.length) : categories.length;
    var eachSpacing = spacingValid / dataCount;
    var xAxisPoints = [];
    var startX = config.padding + yAxisTotalWidth;
    var endX = opts.width - config.padding;
    categories.forEach(function (item, index) {
        xAxisPoints.push(startX + index * eachSpacing);
    });
    if (opts.enableScroll === true) {
        xAxisPoints.push(startX + categories.length * eachSpacing);
    }
    else {
        xAxisPoints.push(endX);
    }
    return { xAxisPoints: xAxisPoints, startX: startX, endX: endX, eachSpacing: eachSpacing };
}
exports.getXAxisPoints = getXAxisPoints;
function getDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config, process) {
    if (process === void 0) { process = 1; }
    var points = [];
    var validHeight = opts.height - 2 * config.padding - config.xAxisHeight - config.legendHeight;
    data.forEach(function (item, index) {
        if (item === null) {
            points.push(null);
        }
        else {
            var point = {};
            point.x = xAxisPoints[index] + Math.round(eachSpacing / 2);
            var height = validHeight * (item - minRange) / (maxRange - minRange);
            height *= process;
            point.y = opts.height - config.xAxisHeight - config.legendHeight - Math.round(height) - config.padding;
            points.push(point);
        }
    });
    return points;
}
exports.getDataPoints = getDataPoints;
function getYAxisTextList(series, opts, config) {
    var data = dataCombine(series);
    // remove null from data
    data = data.filter(function (item) {
        return item !== null;
    });
    var minData = Math.min.apply(this, data);
    var maxData = Math.max.apply(this, data);
    if (typeof opts.yAxis.min === 'number') {
        minData = Math.min(opts.yAxis.min, minData);
    }
    if (typeof opts.yAxis.max === 'number') {
        maxData = Math.max(opts.yAxis.max, maxData);
    }
    // fix issue https://github.com/xiaolin3303/wx-charts/issues/9
    if (minData === maxData) {
        var rangeSpan = maxData || 1;
        minData -= rangeSpan;
        maxData += rangeSpan;
    }
    var dataRange = charts_util_1.getDataRange(minData, maxData);
    var minRange = dataRange.minRange;
    var maxRange = dataRange.maxRange;
    var range = [];
    var eachRange = (maxRange - minRange) / config.yAxisSplit;
    for (var i = 0; i <= config.yAxisSplit; i++) {
        range.push(minRange + eachRange * i);
    }
    return range.reverse();
}
exports.getYAxisTextList = getYAxisTextList;
function calYAxisData(series, opts, config) {
    var ranges = getYAxisTextList(series, opts, config);
    var yAxisWidth = config.yAxisWidth;
    var rangesFormat = ranges.map(function (item) {
        item = util_1.Util.toFixed(item, 2);
        item = opts.yAxis.format ? opts.yAxis.format(Number(item)) : item;
        yAxisWidth = Math.max(yAxisWidth, charts_util_1.measureText(item) + 5);
        return item;
    });
    if (opts.yAxis.disabled === true) {
        yAxisWidth = 0;
    }
    return { rangesFormat: rangesFormat, ranges: ranges, yAxisWidth: yAxisWidth };
}
exports.calYAxisData = calYAxisData;
