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
    }
};
//# sourceMappingURL=Pipes.js.map