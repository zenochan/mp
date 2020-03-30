"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var Pipes_1 = require("./Pipes");
Component({
    properties: {
        value: {
            type: Array, value: [], observer: function (arrays) {
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
                            val_1 = Pipes_1.Pipes[method].apply(Pipes_1.Pipes, __spreadArrays([val_1], pipeArr));
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
    },
});
