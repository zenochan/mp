const KEY = "search_keys";

export class SearchUtil
{

  static searchRecords()
  {
    return wx.getStorageSync(KEY) || []
  }

  static saveRecord(keyword)
  {
    let records = this.searchRecords();
    records.unshift(keyword);
    // @ts-ignore
    records = Array.from(new Set(records));
    wx.setStorageSync(KEY, records)
  }

  static clear()
  {
    wx.setStorageSync(KEY, [])
  }
}
