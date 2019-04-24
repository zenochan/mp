const KEY = "search_keys";

export class Keywords
{

  static history(type?: string): string[]
  {
    return wx.getStorageSync(type || KEY) || []
  }

  static save(keyword, type?: string): string[]
  {
    let records = this.history(type);
    records.unshift(keyword);
    // @ts-ignore
    records = Array.from(new Set(records));
    wx.setStorageSync(type || KEY, records);

    return records;
  }

  static clear(type?: string)
  {
    wx.setStorageSync(type || KEY, [])
  }
}
