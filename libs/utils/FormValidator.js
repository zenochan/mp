"use strict";
exports.__esModule = true;
exports.FormValidator = void 0;
var FormValidator = /** @class */ (function () {
    // eslint-disable-next-line no-useless-constructor,no-empty-function
    function FormValidator(rules, messages) {
        this.rules = rules;
        this.messages = messages;
    }
    FormValidator.prototype.validate = function (form) {
        var _this = this;
        var errorList = [];
        Object.entries(this.rules).forEach(function (_a) {
            var key = _a[0], rule = _a[1];
            if (rule.required && !FormValidator.required(form[key])) {
                errorList.push((_this.messages[key] || {}).required || ("\u8BF7\u586B\u5199 " + key));
            }
            if (rule.idCard && !FormValidator.idCard(form[key])) {
                errorList.push((_this.messages[key] || {}).idCard || (key + " \u4E0D\u662F\u6709\u6548\u7684\u8EAB\u4EFD\u8BC1\u53F7"));
            }
            if (rule.chineseName && !FormValidator.chineseName(form[key])) {
                errorList.push((_this.messages[key] || {}).chineseName || (key + " \u4E0D\u662F\u6709\u6548\u7684\u59D3\u540D"));
            }
            if (rule.mobile && !FormValidator.mobile(form[key])) {
                errorList.push((_this.messages[key] || {}).mobile || (key + " \u4E0D\u662F\u6709\u6548\u7684\u624B\u673A\u53F7"));
            }
            if (rule.minLength && !FormValidator.minLength(form[key], rule.minLength)) {
                errorList.push((_this.messages[key] || {}).minLength || (key + " \u81F3\u5C11\u9700\u8981" + rule.minLength));
            }
            if (rule.fun && !rule.fun(form[key], form)) {
                errorList.push((_this.messages[key] || {}).fun || (key + " \u4E0D\u7B26\u5408\u8981\u6C42"));
            }
        });
        return errorList;
    };
    FormValidator.required = function (value) {
        return (value || '').toString().length > 0;
    };
    FormValidator.idCard = function (value) {
        if (typeof value !== 'string' || value.length != 18)
            return false;
        var weight = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        var checkCode = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
        var total = 0;
        for (var i = 0; i < 17; i++) {
            total += parseInt(value[i]) * weight[i];
        }
        return value[17] == checkCode[total % 11];
    };
    FormValidator.chineseName = function (value) {
        return /^[\u4e00-\u9fa5]{2,}$/.test(value);
    };
    FormValidator.mobile = function (value) {
        return /^1[3456789]\d{9}$/.test(value);
    };
    FormValidator.minLength = function (value, length) {
        return value.length >= length;
    };
    return FormValidator;
}());
exports.FormValidator = FormValidator;
