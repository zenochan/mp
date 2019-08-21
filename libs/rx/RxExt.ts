import {Observable} from "./Rx";

export function rxJust<T>(value: T): Observable<T>
{
  return Observable.create(sub => {
    sub.next(value);
    sub.complete();
  })
}

export function rxFromPromise<T>(promise: Promise<T>): Observable<T>
{
  return Observable.create(sub => {
    promise.then(res => {
      sub.next(res);
      sub.complete();

    }).catch(e => sub.error(e))
  });
}
