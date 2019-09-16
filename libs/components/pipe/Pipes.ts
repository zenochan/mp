import "../../utils/extends.date";

export const Pipes: { [key: string]: (...args) => string } = {

  /**
   * 时间处理管道
   * <pipe data="dateString|date:fmt"></pipe>
   * @param val
   * @param format
   */
  date(val: string, format?: string): string
  {
    return val.dateFormat(format || 'yyyy-MM-dd');
  },

  attr(val: any, key: string)
  {
    if (Array.isArray(val)) {
      return val.map(item => item[key])
    } else if (typeof val === 'object') {
      return val[key]
    }
    return ''
  },

  join(val: string[], septor: string)
  {
    return val.join(septor) || ''
  }

};

