export interface Rule {
  required?: boolean
  mobile?: boolean
  idCard?: boolean
  chineseName?: boolean
  minLength?: number
  fun?: (value: any, formData: any) => boolean
}

export interface Message {
  required?: string
  mobile?: string
  idCard?: string
  chineseName?: string
  minLength?: string
  fun?: string
}

export interface Rules {
  [key: string]: Rule
}

export interface Messages {
  [key: string]: Message
}

export class FormValidator {
  // eslint-disable-next-line no-useless-constructor,no-empty-function
  constructor(private rules: Rules, private messages: Messages) {
  }

  validate(form: Object): string[] {
    const errorList = [];

    Object.entries(this.rules).forEach(([key, rule]) => {
      if (rule.required && !FormValidator.required(form[key])) {
        errorList.push((this.messages[key] || {}).required || (`请填写 ${key}`));
      }

      if (rule.idCard && !FormValidator.idCard(form[key])) {
        errorList.push((this.messages[key] || {}).idCard || (`${key} 不是有效的身份证号`));
      }

      if (rule.chineseName && !FormValidator.chineseName(form[key])) {
        errorList.push((this.messages[key] || {}).chineseName || (`${key} 不是有效的姓名`));
      }

      if (rule.mobile && !FormValidator.mobile(form[key])) {
        errorList.push((this.messages[key] || {}).mobile || (`${key} 不是有效的手机号`));
      }

      if (rule.minLength && !FormValidator.minLength(form[key], rule.minLength)) {
        errorList.push((this.messages[key] || {}).minLength || (`${key} 至少需要${rule.minLength}`));
      }

      if (rule.fun && !rule.fun(form[key], form)) {
        errorList.push((this.messages[key] || {}).fun || (`${key} 不符合要求`));
      }
    });
    return errorList;
  }

  static required(value) {
    return (value || '').toString().length > 0;
  }

  static idCard(value: string) {
    if (typeof value !== 'string' || value.length != 18) return false;

    const weight = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const checkCode = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];

    let total = 0;
    for (let i = 0; i < 17; i++) {
      total += parseInt(value[i]) * weight[i];
    }
    return value[17] == checkCode[total % 11];
  }

  static chineseName(value: string) {
    return /^[\u4e00-\u9fa5]{2,}$/.test(value);
  }

  static mobile(value: string) {
    return /^1[3456789]\d{9}$/.test(value);
  }

  static minLength(value: string | any[], length) {
    return value.length >= length;
  }
}
