const KEY = "keywords_20190424";

export class Keywords
{
  static data(type?: string)
  {
    return wx.getStorageSync(type || KEY) || []
  }

  static save(keyword, type?: string)
  {
    let records = this.data(type);
    records.unshift(keyword);
    // @ts-ignore
    records = Array.from(new Set(records));
    wx.setStorageSync(type || KEY, records)
  }

  static clear(type?: string)
  {
    wx.setStorageSync(type || KEY, [])
  }
}
