import {Data, rxJust, WX} from "../mp";
import {Observable} from "../rx/Rx";

/**
 * 小程序 session 管理
 */
export class SessionService
{
  public static code2Session: (code: string) => Observable<Session> = null;
  private static session_key = "SessionService:session";

  static get(refresh: boolean = false): Observable<Session>
  {
    if (!this.code2Session) throw "请配置 code2Session";

    return WX.checkSession().flatMap(res => {
      let cache = Data.get(this.session_key);
      if (cache && res && !refresh) {
        console.warn("session:cached");
        return rxJust(cache)
      } else {
        console.warn("session:refresh");
        Data.set(this.session_key, null);
        return WX.login().flatMap(code => this.code2Session(code)).map(session => {
          Data.set(this.session_key, session)
          return session
        })
      }
    })
  }

  static getSync(): Session | null
  {
    return Data.get(this.session_key) || null;
  }
}
