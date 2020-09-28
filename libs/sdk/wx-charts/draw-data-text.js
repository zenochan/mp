"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var charts_util_1 = require("./charts-util");
var util_1 = require("./util");
function drawRingTitle(opts, config, context) {
    var titlefontSize = opts.title.fontSize || config.titleFontSize;
    var subtitlefontSize = opts.subtitle.fontSize || config.subtitleFontSize;
    var title = opts.title.name || '';
    var subtitle = opts.subtitle.name || '';
    var titleFontColor = opts.title.color || config.titleColor;
    var subtitleFontColor = opts.subtitle.color || config.subtitleColor;
    var titleHeight = title ? titlefontSize : 0;
    var subtitleHeight = subtitle ? subtitlefontSize : 0;
    var margin = 5;
    if (subtitle) {
        var textWidth = charts_util_1.measureText(subtitle, subtitlefontSize);
        var startX = (opts.width - textWidth) / 2 + (opts.subtitle.offsetX || 0);
        var startY = (opts.height - config.legendHeight + subtitlefontSize) / 2;
        if (title) {
            startY -= (titleHeight + margin) / 2;
        }
        context.beginPath();
        context.setFontSize(subtitlefontSize);
        context.setFillStyle(subtitleFontColor);
        context.fillText(subtitle, startX, startY);
        context.stroke();
        context.closePath();
    }
    if (title) {
        var textWidth = charts_util_1.measureText(title, titlefontSize);
        var startX = (opts.width - textWidth) / 2 + (opts.title.offsetX || 0);
        var startY = (opts.height - config.legendHeight + titlefontSize) / 2;
        if (subtitle) {
            startY += (subtitleHeight + margin) / 2;
        }
        context.beginPath();
        context.setFontSize(titlefontSize);
        context.setFillStyle(titleFontColor);
        context.fillText(title, startX, startY);
        context.stroke();
        context.closePath();
    }
}
exports.drawRingTitle = drawRingTitle;
function drawPointText(points, series, config, context) {
    // 绘制数据文案
    var data = series.data;
    context.beginPath();
    context.setFontSize(config.fontSize);
    context.setFillStyle('#666666');
    points.forEach(function (item, index) {
        if (item !== null) {
            var formatVal = series.format ? series.format(data[index]) : data[index];
            context.fillText(formatVal, item.x - charts_util_1.measureText(formatVal) / 2, item.y - 2);
        }
    });
    context.closePath();
    context.stroke();
}
exports.drawPointText = drawPointText;
function drawRadarLabel(angleList, radius, centerPosition, opts, config, context) {
    var radarOption = opts.extra.radar || {};
    radius += config.radarLabelTextMargin;
    context.beginPath();
    context.setFontSize(config.fontSize);
    context.setFillStyle(radarOption.labelColor || '#666666');
    angleList.forEach(function (angle, index) {
        var pos = {
            x: radius * Math.cos(angle),
            y: radius * Math.sin(angle)
        };
        var posRelativeCanvas = charts_util_1.convertCoordinateOrigin(pos.x, pos.y, centerPosition);
        var startX = posRelativeCanvas.x;
        var startY = posRelativeCanvas.y;
        if (util_1.Util.approximatelyEqual(pos.x, 0)) {
            startX -= charts_util_1.measureText(opts.categories[index] || '') / 2;
        }
        else if (pos.x < 0) {
            startX -= charts_util_1.measureText(opts.categories[index] || '');
        }
        context.fillText(opts.categories[index] || '', startX, startY + config.fontSize / 2);
    });
    context.stroke();
    context.closePath();
}
exports.drawRadarLabel = drawRadarLabel;
function drawPieText(series, opts, config, context, radius, center) {
    var lineRadius = radius + config.pieChartLinePadding;
    var textRadius = lineRadius + config.pieChartTextPadding;
    var textObjectCollection = [];
    var lastTextObject = null;
    var seriesConvert = series.map(function (item) {
        var arc = 2 * Math.PI - (item._start_ + 2 * Math.PI * item._proportion_ / 2);
        var text = item.format ? item.format(+item._proportion_.toFixed(2)) : util_1.Util.toFixed(item._proportion_ * 100) + "%";
        var color = item.color;
        return { arc: arc, text: text, color: color };
    });
    seriesConvert.forEach(function (item) {
        // line end
        var orginX1 = Math.cos(item.arc) * lineRadius;
        var orginY1 = Math.sin(item.arc) * lineRadius;
        // line start
        var orginX2 = Math.cos(item.arc) * radius;
        var orginY2 = Math.sin(item.arc) * radius;
        // text start
        var orginX3 = orginX1 >= 0 ? orginX1 + config.pieChartTextPadding : orginX1 - config.pieChartTextPadding;
        var orginY3 = orginY1;
        var textWidth = charts_util_1.measureText(item.text);
        var startY = orginY3;
        if (lastTextObject && util_1.Util.isSameXCoordinateArea(lastTextObject.start, { x: orginX3 })) {
            if (orginX3 > 0) {
                startY = Math.min(orginY3, lastTextObject.start.y);
            }
            else if (orginX1 < 0) {
                startY = Math.max(orginY3, lastTextObject.start.y);
            }
            else {
                if (orginY3 > 0) {
                    startY = Math.max(orginY3, lastTextObject.start.y);
                }
                else {
                    startY = Math.min(orginY3, lastTextObject.start.y);
                }
            }
        }
        if (orginX3 < 0) {
            orginX3 -= textWidth;
        }
        var textObject = {
            lineStart: {
                x: orginX2,
                y: orginY2
            },
            lineEnd: {
                x: orginX1,
                y: orginY1
            },
            start: {
                x: orginX3,
                y: startY
            },
            width: textWidth,
            height: config.fontSize,
            text: item.text,
            color: item.color
        };
        lastTextObject = charts_util_1.avoidCollision(textObject, lastTextObject);
        textObjectCollection.push(lastTextObject);
    });
    textObjectCollection.forEach(function (item) {
        var lineStartPoistion = charts_util_1.convertCoordinateOrigin(item.lineStart.x, item.lineStart.y, center);
        var lineEndPoistion = charts_util_1.convertCoordinateOrigin(item.lineEnd.x, item.lineEnd.y, center);
        var textPosition = charts_util_1.convertCoordinateOrigin(item.start.x, item.start.y, center);
        context.setLineWidth(1);
        context.setFontSize(config.fontSize);
        context.beginPath();
        context.setStrokeStyle(item.color);
        context.setFillStyle(item.color);
        context.moveTo(lineStartPoistion.x, lineStartPoistion.y);
        var curveStartX = item.start.x < 0 ? textPosition.x + item.width : textPosition.x;
        var textStartX = item.start.x < 0 ? textPosition.x - 5 : textPosition.x + 5;
        context.quadraticCurveTo(lineEndPoistion.x, lineEndPoistion.y, curveStartX, textPosition.y);
        context.moveTo(lineStartPoistion.x, lineStartPoistion.y);
        context.stroke();
        context.closePath();
        context.beginPath();
        context.moveTo(textPosition.x + item.width, textPosition.y);
        context.arc(curveStartX, textPosition.y, 2, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
        context.beginPath();
        context.setFillStyle('#666666');
        context.fillText(item.text, textStartX, textPosition.y + 3);
        context.closePath();
        context.stroke();
        context.closePath();
    });
}
exports.drawPieText = drawPieText;
//# sourceMappingURL=draw-data-text.js.map