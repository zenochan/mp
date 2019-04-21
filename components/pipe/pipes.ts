import "../../libs/utils/extends.date";

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
  }

};

