export class Validator
{

  /**
   * 验证银行卡号
   * @param cardNo
   */
  static validateBankCardNo(cardNo: string): boolean
  {
    let _cardNo = cardNo.split("").map(val => parseInt(val));
    console.log(_cardNo);

    let sum = 0;
    _cardNo.splice(0, _cardNo.length - 1).forEach((item, index) => {
      if (index % 2 == 1) {
        let a = item * 2;
        sum += a % 10;
        sum += Math.floor(a / 10)
      } else {
        sum += item
      }
    });

    let code = (10 - (sum % 10)) % 10;
    return code === _cardNo[0]
  }


  /**
   * 验证统一社会信用代码
   * @param code
   * @see https://blog.csdn.net/sinat_28071063/article/details/78902193
   */
  static validateSocialCreditCodeOrg(code: string): boolean
  {
    let reg = /^[0-9A-Z]+$/;
    //18位校验及大写校验
    if ((code.length != 18) || (reg.test(code) == false)) {
      return false;
    } else {
      let Ancode;//信用代码/税号的每一个值
      let Ancodevalue;//信用代码/税号每一个值的权重
      let total = 0;
      let weightedFactors = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];//加权因子
      let str = '0123456789ABCDEFGHJKLMNPQRTUWXY';

      //不用I、O、S、V、Z
      for (let i = 0; i < code.length - 1; i++) {
        Ancode = code.substring(i, i + 1);
        Ancodevalue = str.indexOf(Ancode);
        total += Ancodevalue * weightedFactors[i];
        //权重与加权因子相乘之和
      }
      let logicCheCkcode: any = 31 - total % 31;
      if (logicCheCkcode == 31) {
        logicCheCkcode = 0;
      }
      let Str = "0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,T,U,W,X,Y";
      let Array_Str = Str.split(',');
      logicCheCkcode = Array_Str[logicCheCkcode];


      let checkcode = code.substring(17, 18);

      return logicCheCkcode == checkcode;
    }
  }

}

