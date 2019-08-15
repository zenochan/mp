/**
 * 微信 API rx 封装
 */
import {BehaviorSubject, Observable} from "../rx/Rx";
import {Data} from "./Data";

export class Events
{
  private static subs = {};

  private static sub(topic: string): BehaviorSubject<any>
  {
    let a = this.subs[topic];
    if (!a) {
      a = new BehaviorSubject("__init__").filter(res => res != "__init__");
      this.subs[topic] = a;
    }

    return a;
  }

  static subscribe(topic: string, cb: (value) => void)
  {
    return this.sub(topic).subscribe(res => cb(res), e => console.error(topic, e))
  }

  /**
   * 仅执行一次
   * @param cb
   */
  static userReady<T>(cb: (user: T) => void)
  {
    Observable.create(sub => {
      this.subscribe("user:update", user => {
        user = Data.getUser();
        if (user) {
          sub.next(user);
          sub.complete();
        }
      });
    }).subscribe(user => cb(user));
  }

  static publish(topic: string, value: any)
  {
    this.sub(topic).next(value)
  }
}
