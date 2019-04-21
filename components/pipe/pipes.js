"use strict";
exports.__esModule = true;
require("../../libs/utils/extends.date");
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
//# sourceMappingURL=pipes.js.map