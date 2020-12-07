import '../../utils/extends.date';

// eslint-disable-next-line import/prefer-default-export
export const Pipes: { [key: string]: (...args) => string | any } = {

  /**
   * 时间处理管道
   * <pipe data="dateString|date:fmt"></pipe>
   * @param val
   * @param format
   */
  date(val: string, format?: string): string {
    return val.dateFormat(format || 'yyyy-MM-dd');
  },

  attr(val: any, key: string) {
    if (Array.isArray(val)) {
      return val.map((item) => item[key]);
    }
    if (typeof val === 'object') {
      return val[key];
    }
    return '';
  },

  join(val: string[], septor: string) {
    return val.join(septor) || '';
  },

  number(val: any, format: string) {
    if (val === 0) return '0';

    let ab: any = format.split('.');
    if (ab.length === 2) {
      ab = parseInt(ab[1]);
    } else {
      ab = 0;
    }

    return parseFloat(`${val}`).toFixed(ab);
  },

  bigNumber(val: any) {
    val = parseInt(`${val}`);
    if (val < 10000) return val;
    return `${(val / 10000).toFixed(1)}W`;
  },
};
