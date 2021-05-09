// pages/index/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowUserName:false,
    userInfo:null,
  },

  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log("获取用户信息成功", res)
        let user = res.userInfo
        this.setData({
          isShowUserName: true,
          userInfo: user,
        })
        user.openid = app.globalData.openid,
        wx.setStorageSync('user', app.globalData.userInfo)
        //跳转
        this.gotoHome();
      },
      fail: res => {
        console.log("获取用户信息失败", res)
      }
    })
  },

  gotoHome:function(){
    console.log("in")
    wx.switchTab({
      url: '/pages/food2/food2',
      success: function(res) {
        console.log("oK")
      },
      fail: function(res){
        console.log("跳转出错")
      }
    })
  },

  onShareAppMessage: function () {

  }
})