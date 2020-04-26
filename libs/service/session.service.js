"use strict";
exports.__esModule = true;
var mp_1 = require("../mp");
/**
 * 小程序 session 管理
 */
var SessionService = /** @class */ (function () {
    function SessionService() {
    }
    SessionService.get = function (refresh) {
        var _this = this;
        if (refresh === void 0) { refresh = false; }
        if (!this.code2Session)
            throw "请配置 code2Session";
        return mp_1.WX.checkSession().flatMap(function (res) {
            var cache = mp_1.Data.get(_this.session_key);
            if (cache && res && !refresh) {
                console.warn("session:cached");
                return mp_1.rxJust(cache);
            }
            else {
                console.warn("session:refresh");
                mp_1.Data.set(_this.session_key, null);
                return mp_1.WX.login().flatMap(function (code) { return _this.code2Session(code); }).map(function (session) {
                    mp_1.Data.set(_this.session_key, session);
                    return session;
                });
            }
        });
    };
    SessionService.getSync = function () {
        return mp_1.Data.get(this.session_key) || null;
    };
    SessionService.code2Session = null;
    SessionService.session_key = "SessionService:session";
    return SessionService;
}());
exports.SessionService = SessionService;
