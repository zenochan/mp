"use strict";
exports.__esModule = true;
var pipes_1 = require("./pipes");
Component({
    properties: {
        value: {
            type: Array, value: [], observer: function (arrays) {
                try {
                    var val_1 = arrays[0];
                    if (!arrays[1]) {
                        this.setData({ text: val_1 });
                        return;
                    }
                    var arr = arrays[1].split("|");
                    arr.forEach(function (pipe) {
                        var pipeArr = pipe.split(":");
                        var method = pipeArr.shift();
                        if (pipes_1.Pipes[method]) {
                            val_1 = pipes_1.Pipes[method].apply(pipes_1.Pipes, [val_1].concat(pipeArr));
                        }
                    });
                    this.setData({ text: val_1 });
                }
                catch (e) {
                    console.error(e);
                }
            }
        },
        equal: {
            type: null,
            value: null
        }
    }
});
//# sourceMappingURL=pipe.js.map