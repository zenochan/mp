"use strict";
exports.__esModule = true;
exports.ChartAnimation = void 0;
var timing_1 = require("./timing");
var ChartAnimation = /** @class */ (function () {
    function ChartAnimation(opts) {
        this.isStop = false;
        this.delay = 17;
        this.startTimeStamp = null;
        this.opts = opts;
        this.duration = typeof opts.duration === 'undefined' ? 1000 : opts.duration;
        this.timing = opts.timing || 'linear';
        this.animationFrame(this.step, this.delay);
    }
    ChartAnimation.prototype.animationFrame = function (step, delay) {
        var _this = this;
        setTimeout(function () {
            var timeStamp = +new Date();
            _this.step(timeStamp);
        }, delay);
    };
    ChartAnimation.prototype.step = function (timestamp) {
        if (timestamp === null || this.isStop === true) {
            this.opts.onProcess && this.opts.onProcess(1);
            this.opts.onAnimationFinish && this.opts.onAnimationFinish();
            return;
        }
        if (this.startTimeStamp === null) {
            this.startTimeStamp = timestamp;
        }
        if (timestamp - this.startTimeStamp < this.opts.duration) {
            var process_1 = (timestamp - this.startTimeStamp) / this.opts.duration;
            var timingFunction = timing_1.Timing[this.opts.timing];
            process_1 = timingFunction(process_1);
            this.opts.onProcess && this.opts.onProcess(process_1);
            this.animationFrame(this.step, this.delay);
        }
        else {
            this.opts.onProcess && this.opts.onProcess(1);
            this.opts.onAnimationFinish && this.opts.onAnimationFinish();
        }
    };
    ;
    // stop animation immediately
    // and tigger onAnimationFinish
    ChartAnimation.prototype.stop = function () {
        this.isStop = true;
    };
    return ChartAnimation;
}());
exports.ChartAnimation = ChartAnimation;
