import {Observable} from "../rx/Rx";

export {};

/**
 * 时间插值器
 *
 * @version 20190326
 * @author Zeno (zenochan@qq.com)
 */
export class Interceptor
{
  static liner(during: number): Observable<number>
  {
    return Observable.create(sub => {
      let value = 0;
      let timer = setInterval(() => {
        sub.next(value / during);
        value += 20;
        if (value > during) clearInterval(timer)
      }, 20);
      return () => clearInterval(timer);
    })
  }

  static easeOut(during)
  {
    return Observable.create(sub => {
      let value = 0;
      let timer = setInterval(() => {
        sub.next(Bezier.value(0, 0, 0.5, 1, value / during));
        value += 20;
        if (value > during) {
          clearInterval(timer);
          sub.complete()
        }
      }, 20);
      return () => clearInterval(timer);
    })
  }
}


/**
 * @see http://cubic-bezier.com
 * @see https://www.cnblogs.com/yanan-boke/p/8875571.html
 * @version 20190326
 * @author Zeno (zenochan@qq.com)
 */
export class Bezier
{
  /**
   *
   * @param x1 [0,1]
   * @param y1 [0,1]
   * @param x2 [0,1]
   * @param y2 [0,1]
   * @param t [0,1]
   */
  static value(x1: number, y1: number, x2: number, y2: number, t: number)
  {

    let cx = 3 * x1;
    let cy = 3 * y1;
    let by = 3 * (y2 - y1) - cy;
    let ay = 1 - cy - by;


    return ((ay * t + by) * t + cy) * t;
  }
}
