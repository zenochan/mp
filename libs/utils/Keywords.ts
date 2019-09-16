export class Keywords
{
  private static KEY = "keywords:";

  static data(type: string = 'default')
  {
    return wx.getStorageSync(this.KEY + type) || []
  }

  static save(keyword, type: string = 'default')
  {
    let records = this.data(type);
    records.unshift(keyword);
    // @ts-ignore
    records = Array.from(new Set(records));
    wx.setStorageSync(this.KEY + type, records)
  }

  static clear(type?: string)
  {
    wx.setStorageSync(type || this.KEY, [])
  }
}
