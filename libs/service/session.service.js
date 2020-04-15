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
        return mp_1.WX.checkSession().flatMap(function (res) {
            var cache = mp_1.Data.get(_this.session_key);
            if (cache && res) {
                return mp_1.rxJust(cache);
            }
            else {
                return mp_1.WX.login().flatMap(function (code) { return _this.code2Session(code); });
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
//# sourceMappingURL=session.service.js.map