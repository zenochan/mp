"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
var Pipes_1 = require("./Pipes");
Component({
    properties: {
        value: {
            type: Array, value: [],
            observer: function (arrays) {
                try {
                    var val_1 = arrays[0];
                    if (!val_1 && val_1 !== 0) {
                        this.setData({ text: '' });
                        return;
                    }
                    if (!arrays[1]) {
                        this.setData({ text: val_1 });
                        return;
                    }
                    var arr = arrays[1].split("||");
                    arr.forEach(function (pipe) {
                        var pipeArr = pipe.split("|");
                        var method = pipeArr.shift();
                        if (Pipes_1.Pipes[method]) {
                            val_1 = Pipes_1.Pipes[method].apply(Pipes_1.Pipes, __spreadArray([val_1], pipeArr));
                        }
                    });
                    this.setData({ text: val_1 });
                }
                catch (e) {
                    console.error("PIPE", arrays, e);
                    this.setData({ text: '' });
                }
            }
        },
        equal: {
            type: null,
            value: null
        }
    }
});
