"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mp_1 = require("../mp");
/**
 * 小程序 session 管理
 */
var SessionService = /** @class */ (function () {
    function SessionService() {
    }
    SessionService.get = function () {
        var _this = this;
        if (!this.code2Session)
            throw "请配置 code2Session";
        var cache = mp_1.Data.get(this.session_key);
        var fresh = mp_1.WX.login()
            .flatMap(function (code) { return _this.code2Session(code); })
            .map(function (session) {
            mp_1.Data.set(_this.session_key, session);
            return session;
        });
        return !cache ? fresh : (mp_1.WX.checkSession().flatMap(function (validate) { return validate ? mp_1.rxJust(cache) : fresh; }));
    };
    SessionService.code2Session = null;
    SessionService.session_key = "SessionService:session";
    return SessionService;
}());
exports.SessionService = SessionService;
//# sourceMappingURL=session.service.js.map