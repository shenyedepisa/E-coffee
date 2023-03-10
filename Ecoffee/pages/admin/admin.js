const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    name:"",
    password:""
  },
 
  //管理员登陆相关
  getName: function (e) {
    this.setData({
      name:e.detail.value
    })
  },

  getPassWord: function (e) {
    this.setData({
      password:e.detail.value
    })
  },
  formSubmit: function () {
    if (this.data.name == '' || this.data.password == undefined) {
      wx.showToast({
        mask:true,
        title: '用户名不能为空',
        icon: 'none',
        duration:1000,
      })
      return;
    }
    if (this.data.password == '' || this.data.password == undefined) {
      wx.showToast({
        mask:true,
        title: '密码不能为空',
        icon: 'none',
        duration:1000,
      })
      return;
    }
    this.login(this.data.name, this.data.password)

  },
  //登录
  login(name, password) {
    console.log(name,password)
    db.collection('admin').where({
        name: name,
        password: password
      }).get()
      .then(res => {
        if (res.data && res.data.length > 0) {
          let admin = {
            name: name,
            password: password,
            staff: res.data[0].staff
          }
          wx.setStorageSync('admin', admin)
          if(admin.staff == "服务员"){
            wx.navigateTo({
              url: '/pages/waiter/waiter',
            })
          }else if(admin.staff == "后厨"){
            wx.navigateTo({
            url: '/pages/cook/cook',
          })
          }else if(admin.staff == "经理"){
            wx.switchTab({
              url: '/pages/mine/mine',
            })
          }
        } else {
          console.log("登陆失败", res)
          wx.showToast({
            mask:true,
            icon: 'none',
            title: '账号或密码错误',
            duration:1000,
          })
        }
      }).catch(res => {
        //console.log("登陆失败", res)
        wx.showToast({
          mask:true,
          icon: 'none',
          title: '登录失败!',
          duration:1000,
        })
      })
  }
})