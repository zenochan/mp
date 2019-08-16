import {db} from "../app";

export class DbService
{
  static injectUsers(page: IPage)
  {
    db.collection('user').get().then(res => page.setData({userList: res.data}))
  }
}
