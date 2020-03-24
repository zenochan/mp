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

    let cache = Data.get(this.session_key);

    let fresh = WX.login()
        .flatMap(code => this.code2Session(code))
        .map(session => {
          Data.set(this.session_key, session);
          return session;
        });

    return !cache ? fresh : (WX.checkSession().flatMap(validate => validate ? rxJust(cache) : fresh))
  }
}
