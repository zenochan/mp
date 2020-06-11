"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FormValidator = /** @class */ (function () {
    function FormValidator(rules, messages) {
        this.rules = rules;
        this.messages = messages;
    }
    FormValidator.prototype.validate = function (form) {
        var _this = this;
        this.errorList = [];
        Object.keys(form).forEach(function (key) {
            var rule = _this.rules[key];
            if (rule) {
                if (rule.required && !_this.required(form[key])) {
                    _this.errorList.push((_this.messages[key] || {}).required || ('请填写 ' + key));
                }
                if (rule.idCard && !_this.idCard(form[key])) {
                    _this.errorList.push((_this.messages[key] || {}).idCard || (key + ' 不是有效的身份证号'));
                }
                if (rule.chineseName && !_this.chineseName(form[key])) {
                    _this.errorList.push((_this.messages[key] || {}).chineseName || (key + ' 不是有效的姓名'));
                }
                if (rule.mobile && !_this.mobile(form[key])) {
                    _this.errorList.push((_this.messages[key] || {}).mobile || (key + ' 不是有效的手机号'));
                }
                if (rule.minLength && !_this.minLength(form[key], rule.minLength)) {
                    _this.errorList.push((_this.messages[key] || {}).minLength || (key + ' 至少需要' + rule.minLength));
                }
                if (rule.fun && !rule.fun(form[key])) {
                    _this.errorList.push((_this.messages[key] || {}).fun || (key + ' 不符合要求'));
                }
            }
        });
        return this.errorList;
    };
    FormValidator.prototype.required = function (value) {
        return (value || "").toString().length > 0;
    };
    FormValidator.prototype.idCard = function (value) {
        if (typeof value != "string" || value.length != 18)
            return false;
        var weight = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        var checkCode = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
        var total = 0;
        for (var i = 0; i < 17; i++) {
            total += parseInt(value[i]) * weight[i];
        }
        return value[17] == checkCode[total % 11];
    };
    FormValidator.prototype.chineseName = function (value) {
        return /^[\u4e00-\u9fa5]{2,}$/.test(value);
    };
    FormValidator.prototype.mobile = function (value) {
        return /^1[3456789]\d{9}$/.test(value);
    };
    FormValidator.prototype.minLength = function (value, length) {
        return value.length >= length;
    };
    return FormValidator;
}());
exports.FormValidator = FormValidator;
//# sourceMappingURL=FormValidator.js.map