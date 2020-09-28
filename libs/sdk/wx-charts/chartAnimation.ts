import {Timing} from "./timing";


export class ChartAnimation {
  isStop = false;
  duration: number;
  timing: string;
  delay = 17;
  opts: any

  constructor(opts: any) {
    this.opts = opts;
    this.duration = typeof opts.duration === 'undefined' ? 1000 : opts.duration;
    this.timing = opts.timing || 'linear';

    this.animationFrame(this.step, this.delay);
  }

  animationFrame(step, delay) {
    setTimeout(() => {
      let timeStamp = +new Date();
      this.step(timeStamp);
    }, delay);
  }

  startTimeStamp = null;

  step(timestamp) {
    if (timestamp === null || this.isStop === true) {
      this.opts.onProcess && this.opts.onProcess(1);
      this.opts.onAnimationFinish && this.opts.onAnimationFinish();
      return;
    }
    if (this.startTimeStamp === null) {
      this.startTimeStamp = timestamp;
    }
    if (timestamp - this.startTimeStamp < this.opts.duration) {
      let process = (timestamp - this.startTimeStamp) / this.opts.duration;
      let timingFunction = Timing[this.opts.timing];
      process = timingFunction(process);
      this.opts.onProcess && this.opts.onProcess(process);
      this.animationFrame(this.step, this.delay);
    } else {
      this.opts.onProcess && this.opts.onProcess(1);
      this.opts.onAnimationFinish && this.opts.onAnimationFinish();
    }
  };

  // stop animation immediately
  // and tigger onAnimationFinish
  stop() {
    this.isStop = true;
  }

}
