const app = getApp();
let admin = ""
let name = ""
let password = ""
const db = wx.cloud.database()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
Page({
  // 页面的初始数据
  data: {
    avatarUrl: defaultAvatarUrl,
    isShowUserName: false,
    userInfo: null,
    isManagerLogin: false,
    waiter: false,
    cook: false,
    manager: false,
  },
  //获取用户信息
  getUserProfile() {
    wx.getUserProfile({
      desc: '授权登录',
      success: (res) => {
        console.log("获取用户信息成功", res)
        let user = res.userInfo
        this.setData({
          isShowUserName: true,
          userInfo: user,
        })
        console.log("userInfo",user);
        user.openid = app.globalData.openid;
        app._saveUserInfo(user);
      },
      fail: res => {
        console.log("获取用户信息失败", res)
      }
    })
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })
  },
  //退出登录
  tuichu() {
    wx.setStorageSync('user', null);
    this.setData({
      userInfo: null,
      isShowUserName: false,
    })
    wx.showToast({
      icon: 'none',
      title: '用户已退出',
    })
  },

  //去管理员页
  goAdmin() {
    wx.navigateTo({
      url: '../admin/admin',
    })
  },
  //跳转
  goWaiter() {
    let admin = wx.getStorageSync('admin')
    if (admin && admin.name && admin.password) {
      //校验
      wx.navigateTo({
        url: '../waiter/waiter',
      })
    }
  },
  goCook() {
    let admin = wx.getStorageSync('admin')
    if (admin && admin.name && admin.password) {
      //校验
      wx.navigateTo({
        url: '../cook/cook',
      })
    }
  },
  goManager() {
    let admin = wx.getStorageSync('admin')
    if (admin && admin.name && admin.password) {
      //校验
      wx.navigateTo({
        url: '../manager/manager',
      })
    }
  },
  goRevenue() {
    let admin = wx.getStorageSync('admin')
    if (admin && admin.name && admin.password) {
      //校验
      wx.navigateTo({
        url: '../charts/charts',
      })
    }
  },
  //管理员退出登录
  quitAdmin() {
    //console.log("quit");
    let tempStaff = wx.getStorageSync('admin').staff;
    wx.setStorageSync('admin', null);
    this.setData({
      isManagerLogin: false,
      waiter: false,
      cook: false,
      manager: false,
    })
    wx.showToast({
      icon: 'none',
      title: '管理员: ' + tempStaff + ' 已退出登录',
    })
  },

  onShow(options) {
    //console.log("admin login")
    let temp1 = wx.getStorageSync('admin');
    let temp2 = wx.getStorageSync('user');
    if (temp2) {
      this.setData({
        isShowUserName: true,
        userInfo: temp2,
      })
    }
    if (temp1) {
      this.setData({
        isManagerLogin: true
      })
      if (temp1.staff == "经理") {
        this.setData({
          manager: true
        })
      } else if (temp1.staff == "后厨") {
        this.setData({
          cook: true
        })
      } else if (temp1.staff == "服务员") {
        this.setData({
          waiter: true
        })
      } else {

      }
    }
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {

  },

})