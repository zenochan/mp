"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Pipes_1 = require("./Pipes");
Component({
    properties: {
        value: {
            type: Array, value: [], observer: function (arrays) {
                try {
                    var val_1 = arrays[0];
                    if (!val_1) {
                        this.setData({ text: '' });
                        return;
                    }
                    if (!arrays[1]) {
                        this.setData({ text: val_1 });
                        return;
                    }
                    var arr = arrays[1].split("|");
                    arr.forEach(function (pipe) {
                        var pipeArr = pipe.split(":");
                        var method = pipeArr.shift();
                        if (Pipes_1.Pipes[method]) {
                            val_1 = Pipes_1.Pipes[method].apply(Pipes_1.Pipes, [val_1].concat(pipeArr));
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
//# sourceMappingURL=pipe.js.map