import { Data, rxJust, WX } from '../mp';
import { Observable } from '../rx/Rx';

/**
 * 小程序 session 管理
 */
export class SessionService {
  public static code2Session: (code: string) => Observable<Session> = null;

  private static SESSION_KEY = 'SessionService:session';

  static get(refresh: boolean = false): Observable<Session> {
    if (!this.code2Session) throw new Error('请配置 code2Session');

    return WX.checkSession().flatMap((res) => {
      const cache = Data.get(this.SESSION_KEY);
      if (cache && res && !refresh) {
        console.warn('session:cached');
        return rxJust(cache);
      }
      console.warn('session:refresh');
      Data.set(this.SESSION_KEY, null);
      return WX.login().flatMap((code) => this.code2Session(code)).map((session) => {
        Data.set(this.SESSION_KEY, session);
        return session;
      });
    });
  }

  static getSync(): Session | null {
    return Data.get(this.SESSION_KEY) || null;
  }
}
