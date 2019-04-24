"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Validator = /** @class */ (function () {
    function Validator() {
    }
    /**
     * 验证银行卡号
     * @param cardNo
     */
    Validator.validateBankCardNo = function (cardNo) {
        var _cardNo = cardNo.split("").map(function (val) { return parseInt(val); });
        console.log(_cardNo);
        var sum = 0;
        _cardNo.splice(0, _cardNo.length - 1).forEach(function (item, index) {
            if (index % 2 == 1) {
                var a = item * 2;
                sum += a % 10;
                sum += Math.floor(a / 10);
            }
            else {
                sum += item;
            }
        });
        var code = (10 - (sum % 10)) % 10;
        return code === _cardNo[0];
    };
    /**
     * 验证统一社会信用代码
     * @param code
     * @see https://blog.csdn.net/sinat_28071063/article/details/78902193
     */
    Validator.validateSocialCreditCodeOrg = function (code) {
        var reg = /^[0-9A-Z]+$/;
        //18位校验及大写校验
        if ((code.length != 18) || (reg.test(code) == false)) {
            return false;
        }
        else {
            var Ancode = //信用代码/税号的每一个值
             void 0; //信用代码/税号的每一个值
            var Ancodevalue = //信用代码/税号每一个值的权重
             void 0; //信用代码/税号每一个值的权重
            var total = 0;
            var weightedFactors = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28]; //加权因子
            var str = '0123456789ABCDEFGHJKLMNPQRTUWXY';
            //不用I、O、S、V、Z
            for (var i = 0; i < code.length - 1; i++) {
                Ancode = code.substring(i, i + 1);
                Ancodevalue = str.indexOf(Ancode);
                total += Ancodevalue * weightedFactors[i];
                //权重与加权因子相乘之和
            }
            var logicCheCkcode = 31 - total % 31;
            if (logicCheCkcode == 31) {
                logicCheCkcode = 0;
            }
            var Str = "0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,T,U,W,X,Y";
            var Array_Str = Str.split(',');
            logicCheCkcode = Array_Str[logicCheCkcode];
            var checkcode = code.substring(17, 18);
            return logicCheCkcode == checkcode;
        }
    };
    return Validator;
}());
exports.Validator = Validator;
//# sourceMappingURL=validator.js.map