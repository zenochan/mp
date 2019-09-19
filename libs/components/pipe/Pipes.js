"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../../utils/extends.date");
exports.Pipes = {
    /**
     * 时间处理管道
     * <pipe data="dateString|date:fmt"></pipe>
     * @param val
     * @param format
     */
    date: function (val, format) {
        return val.dateFormat(format || 'yyyy-MM-dd');
    },
    attr: function (val, key) {
        if (Array.isArray(val)) {
            return val.map(function (item) { return item[key]; });
        }
        else if (typeof val === 'object') {
            return val[key];
        }
        return '';
    },
    join: function (val, septor) {
        return val.join(septor) || '';
    },
    number: function (val, format) {
        var ab = format.split(".");
        if (ab.length == 2) {
            ab = parseInt(ab[1]);
        }
        else {
            ab = 0;
        }
        return parseFloat(val + "").toFixed(ab);
    },
    bigNumber: function (val) {
        var unit = "W";
        val = parseInt(val + "");
        if (val < 10000)
            return val;
        return (val / 10000).toFixed(1) + 'W';
    }
};
//# sourceMappingURL=Pipes.js.map