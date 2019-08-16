import {HookPage} from "../../libs/wx/weapp";
import {db} from "../../app";

HookPage({
  navTitle: '用户列表',
  onLoad()
  {
    this.getUsers();
  },
  addUser()
  {
    db.collection('user').add({data:this.data.form}).then(res=>this.getUsers())
  },
  getUsers(){
    db.collection("user").get().then(res => this.setData({userList: res.data}));
  }
});
