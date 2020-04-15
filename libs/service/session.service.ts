import {Observable} from "../rx/Observable";
import {Data, rxJust, WX} from "../mp";

/**
 * 小程序 session 管理
 */
export class SessionService
{
  public static code2Session: (code: string) => Observable<Session> = null;
  private static session_key = "SessionService:session";

  static get(): Observable<Session>
  {
    if (!this.code2Session) throw "请配置 code2Session";

    return WX.checkSession().flatMap(res => {
      let cache = Data.get(this.session_key);
      if (cache && res) {
        return rxJust(cache)
      } else {
        return WX.login().flatMap(code => this.code2Session(code))
      }
    })
  }

  static getSync(): Session | null
  {
    return Data.get(this.session_key) || null;
  }
}
